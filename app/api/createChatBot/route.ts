import { bullMQQueue } from "@/global";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { ApplicationError, UserError } from "@/lib/errors";

const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const POST = async (request: NextRequest) => {
  try {
    if (!supabaseUrl) {
      throw new ApplicationError("Missing environment variable SUPABASE_URL");
    }

    if (!supabaseServiceKey) {
      throw new ApplicationError(
        "Missing environment variable SUPABASE_SERVICE_ROLE_KEY"
      );
    }

    const {
      name,
      imageURL,
      githubRepoURL,
      repoDocsDirectoryPath,
      description,
    } = await request.json();

    if (
      !name ||
      !githubRepoURL ||
      !githubRepoURL.endsWith(".git") ||
      !githubRepoURL.startsWith("https://github.com/") ||
      description.length > 200
    ) {
      throw new UserError(
        "Invalid request, check form fields for any mistakes"
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      throw new UserError("Please login and try again");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const {
      data: { credits: userCredits },
    } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .limit(1)
      .maybeSingle();

    if (!userCredits) {
      throw new UserError(
        "You have no credits left, please buy more to create chatbots"
      );
    }

    const { data: chatbotCreateResponse, error: chatbotCreateError } =
      await supabaseAdmin
        .from("training_groups")
        .insert({
          name,
          user_id: authUser.id,
          git_source_url: githubRepoURL,
          git_source_doc_dir_path: repoDocsDirectoryPath || null,
          image_url: imageURL,
          description,
        })
        .select("id")
        .maybeSingle();

    if (chatbotCreateError || !chatbotCreateResponse) {
      throw new UserError("Something went wrong, please try later");
    }

    await bullMQQueue.add("processDocs", {
      trainingGroupId: chatbotCreateResponse.id,
    });

    return NextResponse.json({
      data: {
        message: "Chatbot created successfully",
      },
    });
  } catch (error) {
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

export { POST, dynamic };
