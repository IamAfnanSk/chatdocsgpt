import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const dynamic = "force-dynamic";

const POST = async (request: Request) => {
  const requestUrl = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });

  await supabase.auth.signOut();

  return NextResponse.redirect(`${requestUrl.origin}`, {
    status: 301,
  });
};

export { POST, dynamic };
