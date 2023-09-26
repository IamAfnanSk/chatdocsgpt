import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const DumpingGround: React.FC = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { data: userData } = await supabaseAdmin
    .from("users")
    .select("is_admin")
    .eq("id", session.user.id)
    .limit(1)
    .maybeSingle();

  if (!userData?.is_admin) {
    return "Unauthorized";
  }

  const { data: queryDumpData } = await supabaseAdmin
    .from("query_dump")
    .select("*")
    .order("id", {
      ascending: false,
    })
    .limit(30);

  if (!queryDumpData) {
    return "no data to show";
  }

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-6">
        {queryDumpData.map((queryData, idx) => {
          return (
            <div
              key={idx}
              className="px-4 py-2 rounded-md bg-secondary overflow-x-auto"
            >
              {new Date(queryData.created_at).toLocaleString()}
              <pre>{JSON.stringify(queryData.query_data, null, 2)}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DumpingGround;
