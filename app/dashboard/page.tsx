import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { DashboardChatBotList } from "@/components/DashboardChatBotList";

const Dashboard: React.FC = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="mt-5">
      <DashboardChatBotList />
    </div>
  );
};

export default Dashboard;
