"use client";

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
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Textarea } from "./ui/textarea";

const AddChatBotDialog: React.FC = () => {
  const [busy, setBusy] = useState(false);

  const handleAddChatbot = async () => {
    setBusy(true);

    const abortController = new AbortController();

    let timeout: NodeJS.Timeout | null = null;

    const response = await fetch("/api/createChatBot", {
      method: "POST",
      signal: abortController.signal,
      body: JSON.stringify({
        name,
        imageURL,
        githubRepoURL,
        repoDocsDirectoryPath,
        description,
      }),
    });

    const responseData = await response.json();

    if (responseData.error) {
      setBusy(false);
      toast.error(responseData.error);
    }

    if (responseData.data && !responseData.error) {
      toast.success(responseData.data.message);

      timeout = setTimeout(() => {
        location.reload();
        setBusy(false);
      }, 3000);
    }

    return () => {
      abortController.abort();
      if (timeout) clearTimeout(timeout);
    };
  };

  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [githubRepoURL, setGithubRepoURL] = useState("");
  const [repoDocsDirectoryPath, setRepoDocsDirectoryPath] = useState("");
  const [description, setDescription] = useState("");
  const [tryQuestion, setTryQuestion] = useState("");

  return (
    <Dialog>
      <DialogTrigger disabled={busy} asChild>
        <Button variant="outline">Create new chatbot</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New chatbot details</DialogTitle>
          <DialogDescription>
            Add details for your new chatbot, click create once done
          </DialogDescription>
          <DialogDescription>
            <span className="text-destructive">NOTE:</span> chatdocsgpt
            currently only supports .mdx files as input source, please make sure
            your docs are in .mdx format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-2">
          <div className="flex flex-col gap-2 items-start">
            <Label htmlFor="name" className="text-right">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              disabled={busy}
              type="text"
              required
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vue.js GPT"
              className="col-span-3"
            />
          </div>

          <div className="flex flex-col gap-2 items-start">
            <Label htmlFor="githubRepoURL" className="text-right">
              GitHub repo url <span className="text-destructive">*</span>
            </Label>
            <Input
              disabled={busy}
              type="text"
              required
              id="githubRepoURL"
              value={githubRepoURL}
              onChange={(e) => setGithubRepoURL(e.target.value)}
              placeholder="https://github.com/IamAfnanSk/damnbackend.git"
              className="col-span-3"
            />
          </div>

          <div className="flex flex-col gap-2 items-start">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              disabled={busy}
              required
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A powerfull vue.js docschatgpt bot"
              className="col-span-3"
            />
          </div>

          <div className="flex flex-col gap-2 items-start">
            <Label htmlFor="imageURL" className="text-right">
              Image url
            </Label>
            <Input
              disabled={busy}
              type="text"
              id="imageURL"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              placeholder="https://www.afnan.dev/_vercel/image?url=/images/logo-dark.svg&w=1536&q=100"
              className="col-span-3"
            />
          </div>

          <div className="flex flex-col gap-2 items-start">
            <Label htmlFor="repoDocsDirectoryPath" className="text-right">
              Repo docs directory path
            </Label>
            <Input
              disabled={busy}
              type="text"
              id="repoDocsDirectoryPath"
              value={repoDocsDirectoryPath}
              onChange={(e) => setRepoDocsDirectoryPath(e.target.value)}
              placeholder="/pages/docs"
              className="col-span-3"
            />
          </div>

          <div className="flex flex-col gap-2 items-start">
            <Label htmlFor="tryQuestion" className="text-right">
              Trial question
            </Label>
            <Input
              disabled={busy}
              type="text"
              id="tryQuestion"
              value={tryQuestion}
              onChange={(e) => setTryQuestion(e.target.value)}
              placeholder="What are react hook?"
              className="col-span-3"
            />
          </div>
        </div>

        <DialogDescription>
          <span className="text-destructive">*</span> indicates required field
        </DialogDescription>

        <DialogDescription>
          This action will deduct 1 credit from your account.
        </DialogDescription>

        <DialogDescription>
          <span className="text-destructive">
            Please make sure all details are correct since your 1 credit can get
            wasted otherwise!!
          </span>
        </DialogDescription>

        <DialogFooter>
          <Button disabled={busy} onClick={handleAddChatbot} type="submit">
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {busy ? "Please wait" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AddChatBotDialog };
