import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { createClient } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import Markdown from "@/components/Markdown";
import { TQueryDumpData, TQueryDumpTableDefinitions } from "@/global";

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

  const { data: queryDumps } = await supabaseAdmin
    .from("query_dump")
    .select("*")
    .order("id", {
      ascending: false,
    })
    .limit(20);

  if (!queryDumps) {
    return "no data to show";
  }

  const processedQueryData: TQueryDumpData[] = queryDumps.map(
    (queryDump: TQueryDumpTableDefinitions) => {
      console.log(queryDump.query_data.data.userFullName);

      const { created_at, id, query_data } = queryDump;

      const formattedDateString = new Date(created_at).toLocaleString("en-IN", {
        dateStyle: "long",
        timeStyle: "long",
      });

      // legacy support until migration done
      const { maxCompletionTokens, temperature, stream, botId, model } =
        query_data.data;

      return {
        ...query_data.data,
        config: query_data.data.config || {
          maxCompletionTokens,
          temperature,
          stream,
          botId,
          model,
        },
        id,
        type: query_data.type,
        formattedDateString,
      };
    }
  );

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-6">
        {processedQueryData.map(
          ({
            formattedDateString,
            id,
            totalCostInUSD,
            userAvatarURL,
            userFullName,
            userEmail,
            userId,
            query,
            answer,
            input,
            output,
            config: { botId },
          }) => {
            return (
              <div
                key={id}
                className="rounded-md text-sm px-6 py-4 bg-slate-50 flex flex-col gap-2"
              >
                <div className="flex items-center flex-wrap justify-between">
                  <div>
                    <span className="font-medium">On: </span>
                    {formattedDateString}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="max-w-max">
                      ~ ₹{(totalCostInUSD * 82).toFixed(4)}
                    </Badge>

                    <Badge className="max-w-max">
                      ${totalCostInUSD?.toFixed(10)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="font-medium">Queried by: </p>

                  {userAvatarURL && (
                    <div className="flex mt-2 items-start gap-3">
                      <Avatar>
                        <AvatarImage
                          className="rounded-full"
                          src={userAvatarURL}
                          alt={userFullName}
                        />
                      </Avatar>

                      <div className="flex flex-col gap-1">
                        {userFullName && (
                          <Badge variant={"outline"} className="max-w-max">
                            {userFullName}
                          </Badge>
                        )}

                        {userEmail && (
                          <Badge variant={"outline"} className="max-w-max">
                            {userEmail}
                          </Badge>
                        )}

                        {userId && (
                          <Badge variant={"outline"} className="max-w-max">
                            {userId}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {!userAvatarURL && <p>Anonymous user</p>}
                </div>

                {(query || input) && (
                  <div className="mt-2">
                    <span className="font-medium">Query: </span>
                    {query || input[input.length - 1].content}
                  </div>
                )}

                {botId && (
                  <div className="mt-2 flex gap-2 items-center">
                    <span className="font-medium">Bot Id: </span>
                    <Badge variant={"outline"}>{botId}</Badge>
                  </div>
                )}

                {(answer || output) && (
                  <div className="mt-2">
                    <span className="font-medium">Answer: </span>
                    <div className="mt-1">
                      <Markdown markdown={answer || output} />
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default DumpingGround;
