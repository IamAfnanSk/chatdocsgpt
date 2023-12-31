import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { AddChatBotDialog } from "@/components/AddChatBotDialog";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";

import Link from "next/link";

export const dynamic = "force-dynamic";

const DashboardChatBotList: React.FC = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/");
  }

  const { data: chatbotsData } = await supabase
    .from("training_groups")
    .select("*");

  const { data: userData } = await supabase
    .from("users")
    .select("credits, is_admin")
    .eq("id", authUser.id)
    .limit(1)
    .maybeSingle();

  return (
    <>
      {userData?.is_admin && (
        <div className="mt-5 mb-5">
          <Link
            className="border-b border-dashed border-primary"
            href={"/dashboard/dumping-ground"}
          >
            Visit dumping ground
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="font-medium text-lg">Your chat bots</p>

        {userData?.credits > 0 ? (
          <div className="flex items-center gap-2">
            <p className="text-xs">{userData?.credits} credits left</p>
            <AddChatBotDialog />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm">
              0 credits left: <br />
              <span className="text-xs">
                Please{" "}
                <Link
                  className="border-b"
                  href={"https://twitter.com/IamAfnanSK"}
                  target="_blank"
                >
                  contact me
                </Link>{" "}
                for credits :)
              </span>
            </p>
            {/* <Button variant="outline">Buy more</Button> */}
          </div>
        )}
      </div>

      {chatbotsData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
          {chatbotsData.map((bot) => {
            return (
              <div key={bot.id} className="py-2 px-5 border rounded-md">
                <div className="flex flex-col gap-2 justify-between h-full">
                  <p className="font-bold">{bot.name}</p>
                  <p className="text-sm flex-1">{bot.description}</p>
                  <span className="text-xs">
                    Status:
                    <Badge className="ml-2" variant="secondary">
                      {bot.is_disabled ? "disabled" : bot.status}
                    </Badge>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export { DashboardChatBotList };
