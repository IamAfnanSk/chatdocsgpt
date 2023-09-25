import "./globals.css";
import { Toaster } from "react-hot-toast";
import { MainNav } from "@/components/MainNav";
import Link from "next/link";
import { HeartIcon, RocketIcon } from "lucide-react";

const metadata = {
  title: "chatdocsgpt",
  description: "Generate chat bots trained on docs provided by you",
};

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen px-4  max-w-4xl mx-auto bg-background flex flex-col w-full">
          <MainNav />

          <main className="flex-1">{children}</main>

          <Toaster />

          <footer className="py-10 flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center ">
              Made with <HeartIcon className="text-destructive w-4 h-4 mx-2" />{" "}
              by
              <Link
                href={"https://afnan.dev?utm_source=chatdocsgpt"}
                target="_blank"
                className="border-b border-dashed border-primary ml-1"
              >
                Afnan Shaikh
              </Link>
            </span>

            <span className="flex items-center">
              <RocketIcon className="w-4 h-4 mr-2" />
              Powered by Supabse, Nextjs and chatdocsgpt
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
export { metadata };
