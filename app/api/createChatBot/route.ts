import { bullMQQueue } from "@/global";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const dynamic = "force-dynamic";

const POST = async (request: NextRequest) => {
  const { name, imageURL, githubRepoURL, repoDocsDirectoryPath, description } =
    await request.json();

  if (
    !name ||
    !githubRepoURL ||
    !githubRepoURL.endsWith(".git") ||
    !githubRepoURL.startsWith("https://github.com/") ||
    description.lenght > 200
  ) {
    return NextResponse.json({
      status: "error",
      error: "Invalid request, check form fields for any mistakes",
    });
  }

  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({
      status: "error",
      error: "Please login and try again",
    });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const {
    data: { credits: userCredits },
  } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .limit(1)
    .maybeSingle();

  if (!userCredits) {
    return NextResponse.json({
      status: "error",
      error: "You have no credits left, please buy more to create chatbots",
    });
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

  console.log(chatbotCreateResponse, chatbotCreateError);

  if (chatbotCreateError || !chatbotCreateResponse) {
    return NextResponse.json({
      status: "error",
      error: "Something went wrong, please try later",
    });
  }

  await bullMQQueue.add("processDocs", {
    trainingGroupId: chatbotCreateResponse.id,
  });

  return NextResponse.json({
    status: "success",
    data: "Chatbot created successfully",
  });
};

export { POST, dynamic };
