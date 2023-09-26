import { Features } from "@/components/Features";
import { SearchDialog } from "@/components/SearchDialog";
import { Badge } from "@/components/ui/badge";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

export const dynamic = "force-dynamic";

const Index = async () => {
  const supabase = createServerComponentClient({ cookies });

  const { data: chatbotsData } = await supabase
    .from("training_groups")
    .select("*, userData:user_id(metadata)")
    .eq("is_disabled", false);

  return (
    <>
      <div className="mt-8">
        <h1 className="text-xl font-bold">chatdocsgpt chat Bots</h1>
      </div>

      {!chatbotsData?.length && (
        <>
          <p className="mt-8 text-lg font-medium">No chat bots to show</p>
          <p className="text-sm mt-3">
            Since all chat bots are currently public they appear here if a user
            creates them.
          </p>
        </>
      )}

      {!!chatbotsData?.length && (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-3 mt-8">
            {chatbotsData.map((bot) => {
              const disabled = bot.status !== "ready";

              return (
                <div
                  key={bot.id}
                  className={`py-4 px-5 border rounded-md ${
                    disabled ? "bg-secondary" : ""
                  }`}
                >
                  <div className="flex flex-col gap-2 h-full">
                    {disabled && (
                      <span className="text-xs mb-2">
                        Chat bot not ready:
                        <Badge className="ml-2" variant={"outline"}>
                          training
                        </Badge>
                      </span>
                    )}

                    {bot.image_url && (
                      <div className="h-10 w-10">
                        <Image
                          width={200}
                          height={200}
                          src={bot.image_url}
                          alt={"chat bot image"}
                          className="object-contain"
                        />
                      </div>
                    )}

                    <p className="font-bold">{bot.name}</p>

                    <p className="flex-1">{bot.description}</p>

                    <p className="text-xs my-1 font-bold">
                      by {bot.userData.metadata.full_name}
                    </p>

                    <SearchDialog bot={bot} disabled={disabled} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <Features />
    </>
  );
};

export default Index;
