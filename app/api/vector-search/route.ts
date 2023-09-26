import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { codeBlock, oneLine } from "common-tags";
import GPT3Tokenizer from "gpt3-tokenizer";
import {
  Configuration,
  OpenAIApi,
  CreateModerationResponse,
  CreateEmbeddingResponse,
  ChatCompletionRequestMessage,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ApplicationError, UserError } from "@/lib/errors";

const openAiKey = process.env.OPENAI_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const config = new Configuration({
  apiKey: openAiKey,
});

const openai = new OpenAIApi(config);

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const POST = async (request: NextRequest) => {
  try {
    if (!openAiKey) {
      throw new ApplicationError("Missing environment variable OPENAI_KEY");
    }

    if (!supabaseUrl) {
      throw new ApplicationError("Missing environment variable SUPABASE_URL");
    }

    if (!supabaseServiceKey) {
      throw new ApplicationError(
        "Missing environment variable SUPABASE_SERVICE_ROLE_KEY"
      );
    }

    const requestData = await request.json();

    if (!requestData) {
      throw new UserError("Missing request data");
    }

    const { prompt: query, botId: trainingGroupId } = requestData;

    if (!query) {
      throw new UserError("Missing query in request data");
    }

    if (query.length > 250) {
      throw new UserError("Query is too big");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Moderate the content to comply with OpenAI T&C
    const sanitizedQuery = query.trim();

    const moderationResponse: CreateModerationResponse = await openai
      .createModeration({ input: sanitizedQuery })
      .then((res) => res.json());

    const [results] = moderationResponse.results;

    if (results.flagged) {
      throw new UserError("Flagged content", {
        flagged: true,
        categories: results.categories,
      });
    }

    // Create embedding from query
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: sanitizedQuery.replaceAll("\n", " "),
    });

    await supabaseClient.from("query_dump").insert({
      query_data: {
        type: "embedding-create",
        data: {
          model: "text-embedding-ada-002",
          input: sanitizedQuery.replaceAll("\n", " "),
          botId: trainingGroupId,
        },
      },
    });

    if (embeddingResponse.status !== 200) {
      throw new ApplicationError(
        "Failed to create embedding for question",
        embeddingResponse
      );
    }

    const {
      data: [{ embedding }],
    }: CreateEmbeddingResponse = await embeddingResponse.json();

    // TODO
    const { error: matchError, data: pageSections } = await supabaseClient.rpc(
      "match_page_sections",
      {
        embedding,
        match_threshold: 0.78,
        match_count: 10,
        min_content_length: 50,
        training_group_id: trainingGroupId,
      }
    );

    if (matchError) {
      throw new ApplicationError("Failed to match page sections", matchError);
    }

    const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
    let tokenCount = 0;
    let contextText = "";

    for (let i = 0; i < pageSections.length; i++) {
      const pageSection = pageSections[i];
      const content = pageSection.content;
      const encoded = tokenizer.encode(content);
      tokenCount += encoded.text.length;

      if (tokenCount >= 2000) {
        break;
      }

      contextText += `${content.trim()}\n---\n`;
    }

    const prompt = codeBlock`
      ${oneLine`
You are a very enthusiastic and extremely skilled senior software engineer who loves to always help people!
Given the following sections from the given documentation, answer the question using only that information, outputted in markdown format.
If you have any URL links, try not to share them, and instead try to help out using the contents of that URL link.
Your answer should not have any relative URL link like [How to Upgrade to React 18](/blog/2022/03/08/react-18-upgrade-guide). If you come across such a link, just don't include it in the answer.
Your answer can have any absolute url link, like [React 18 announcement post](https://github.com/reactwg/react-18/discussions/4).
Give as many helpful code examples as you can.
Keep the answer as short as you can.
If you are unsure and the answer is not explicitly written in
the documentation, say, "Sorry, I don't know how to help with that."
      `}

      Context sections:
      ${contextText}

      Question: """
      ${sanitizedQuery}
      """

      Answer as markdown (including related code snippets if available) and do not share any relative URL links, please:
    `;

    const chatMessage: ChatCompletionRequestMessage = {
      role: "user",
      content: prompt,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [chatMessage],
      max_tokens: 512,
      temperature: 0,
      stream: true,
    });

    await supabaseClient.from("query_dump").insert({
      query_data: {
        type: "create-completion",
        data: {
          model: "gpt-3.5-turbo",
          messages: [chatMessage],
          max_tokens: 512,
          temperature: 0,
          stream: true,
          contextText,
          query,
          tokenCount,
          botId: trainingGroupId,
        },
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApplicationError("Failed to generate completion", error);
    }

    // Transform the response into a readable stream
    const stream = OpenAIStream(response, {
      onCompletion: async (completion) => {
        const encoded = tokenizer.encode(completion);
        const completionTokenCount = encoded.text.length;

        await supabaseClient.from("query_dump").insert({
          query_data: {
            type: "on-completion",
            data: {
              model: "gpt-3.5-turbo",
              messages: [chatMessage],
              max_tokens: 512,
              temperature: 0,
              stream: true,
              contextText,
              query,
              queryTokenCount: tokenCount,
              completion,
              completionTokenCount,
              totalTokenCount: tokenCount + completionTokenCount,
              botId: trainingGroupId,
            },
          },
        });
      },
    });

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    if (error instanceof UserError) {
      return new Response(
        JSON.stringify({
          error: error.message,
          data: error.data,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (error instanceof ApplicationError) {
      // Print out application errors with their additional data
      console.error(`${error.message}: ${JSON.stringify(error.data)}`);
    } else {
      // Print out unexpected errors as is to help with debugging
      console.error(error);
    }

    return new Response(
      JSON.stringify({
        error: "There was an error processing your request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};