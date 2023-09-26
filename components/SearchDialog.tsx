"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCompletion } from "ai/react";
import {
  Frown,
  CornerDownLeft,
  Wand,
  Loader2,
  StopCircleIcon,
  User2Icon,
  FlaskConicalIcon,
} from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

import Markdown from "@/components/Markdown";
import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { Badge } from "./ui/badge";

const SearchDialog: React.FC<{ bot: any; disabled: boolean }> = ({
  bot,
  disabled,
}) => {
  const [query, setQuery] = useState<string>("");

  const { complete, completion, isLoading, error, stop } = useCompletion({
    api: "/api/vector-search",
    body: {
      botId: bot.id,
    },
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    (window as any).gtag?.("event", "asked-query", {
      query,
      userId: authUser?.id,
    });
    complete(query);
  };

  const [authUser, setAuthUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    };

    getUser();
  }, [supabase, setAuthUser]);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={disabled} size={"sm"} className="max-w-max min-w-0">
            Chat
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto min-w-0">
          <DialogHeader>
            <DialogTitle>
              <span className="flex items-center gap-2 flex-wrap">
                <span>chatdocgpt powered bot: {bot.name} </span>

                <Badge variant={"default"}>
                  <FlaskConicalIcon className="h-3 w-3 mr-1" />
                  <span className="text-xs">experimental</span>
                </Badge>
              </span>
            </DialogTitle>

            <DialogDescription className="text-left text-primary">
              {bot.description}
            </DialogDescription>
            <hr />
            <DialogDescription className="text-left">
              <p className={`text-xs mt-2`}>
                <span className="text-primary font-bold">Note:</span> We are
                currently using{" "}
                <span className="p-0.5 rounded-sm bg-slate-100">
                  gpt-3.5-turbo
                </span>{" "}
                model to cut cost.{" "}
                <span className="p-0.5 rounded-sm bg-slate-100">gpt-4</span>
                can generate even better answers!
              </p>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="min-w-0">
            <div className="flex flex-col gap-4 text-primary min-w-0">
              {query && (
                <div className="flex gap-4 items-center min-w-0">
                  <div className="w-8 h-8 shrink-0 block">
                    {authUser ? (
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          className="rounded-full"
                          src={authUser?.user_metadata.avatar_url}
                          alt={authUser?.user_metadata.full_name}
                        />
                      </Avatar>
                    ) : (
                      <User2Icon className="w-8 h-8" />
                    )}
                  </div>
                  <p className="text-sm font-semibold">{query}</p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-4">
                  <span className="bg-gray-50 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Frown width={18} />
                  </span>
                  <span className="text-sm">
                    Something went wrong and the search has failed! Please try
                    again.
                  </span>
                </div>
              )}

              {(isLoading || completion) && !error ? (
                <div className="flex flex-col gap-4 min-0 max-w-full">
                  <div className="flex items-center gap-2 justify-between min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-50 w-8 h-8 rounded-full text-center flex items-center justify-center">
                        <Wand width={18} />
                      </span>
                      <h3 className="font-semibold">Answer:</h3>
                    </div>

                    {isLoading && (
                      <div className="max-w-max">
                        <Button
                          type="button"
                          onClick={stop}
                          variant={"outline"}
                          size={"sm"}
                        >
                          <StopCircleIcon className="mr-2 h-4 w-4" /> stop
                          generating
                        </Button>
                      </div>
                    )}
                  </div>

                  {completion && <Markdown markdown={completion} />}

                  {isLoading && !completion && (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  )}
                </div>
              ) : null}

              <div className="relative min-w-0">
                <Input
                  placeholder="Ask a question..."
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="col-span-3"
                />
                <CornerDownLeft
                  className={`absolute bg-background top-3 right-5 h-4 w-4 text-primary transition-opacity ${
                    query ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>

              {bot.try_question && (
                <div className="text-xs min-w-0">
                  Or try:{" "}
                  <button
                    type="button"
                    className="px-1.5 py-0.5
                  text-xs
                  bg-slate-50 
                  hover:bg-slate-100 
                  rounded border border-slate-200 
                  transition-colors"
                    onClick={(_) => setQuery(bot.try_question)}
                  >
                    {bot.try_question}
                  </button>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                className={`mt-2 min-w-0 ${bot.try_question ? "sm:mt-0" : ""}`}
                disabled={isLoading}
                type="submit"
              >
                Ask
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { SearchDialog };
