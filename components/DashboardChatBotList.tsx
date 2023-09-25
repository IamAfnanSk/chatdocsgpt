import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { AddChatBotDialog } from "@/components/AddChatBotDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

const dynamic = "force-dynamic";

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

  const {
    data: { credits: userCredits },
  } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .limit(1)
    .maybeSingle();

  const handleBuyMoreCredits = () => {
    toast("Please contact me for credits :)");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="font-medium text-lg">Your chatbots</p>

        {userCredits > 0 ? (
          <div className="flex items-center gap-2">
            <p className="text-xs">{userCredits} credits left</p>
            <AddChatBotDialog />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm">0 credits left</p>
            <Button onClick={handleBuyMoreCredits} variant="outline">
              Buy more
            </Button>
          </div>
        )}
      </div>

      {chatbotsData && (
        <div className="flex flex-col gap-3 mt-5">
          {chatbotsData.map((bot) => {
            return (
              <div key={bot.id} className="py-2 px-5 border rounded-md">
                <div className="flex items-center justify-between">
                  <p>{bot.name}</p>
                  <Badge variant="secondary">Status: {bot.status}</Badge>
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

export { dynamic };
