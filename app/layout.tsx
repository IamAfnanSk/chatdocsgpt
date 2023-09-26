import "./globals.css";
import { Toaster } from "react-hot-toast";
import { MainNav } from "@/components/MainNav";
import Link from "next/link";
import { HeartIcon, RocketIcon, TwitterIcon } from "lucide-react";
import Script from "next/script";

export const metadata = {
  title: "chatdocsgpt",
  description: "Generate chat bots trained on docs provided by you",
};

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-3VXXLKPPLS" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3VXXLKPPLS');
          `}
        </Script>

        <div className="min-h-screen px-4  max-w-4xl mx-auto bg-background flex flex-col w-full">
          <MainNav />

          <main className="flex-1">{children}</main>

          <Toaster />

          <footer className="py-10 flex items-center text-sm justify-between flex-wrap gap-2">
            <div className="flex items-center ">
              <span className="flex items-center">
                Made with{" "}
                <HeartIcon className="text-destructive shrink-0 w-4 h-4 mx-1" />{" "}
                by
              </span>
              <Link
                href={"https://afnan.dev?utm_source=chatdocsgpt"}
                target="_blank"
                className="border-b border-dashed border-primary ml-1"
              >
                Afnan Shaikh
              </Link>

              <span className="mx-3 h-4 w-[1px] bg-primary"></span>

              <Link
                href={"https://peerlist.io/iamafnansk"}
                target="_blank"
                className="border-b border-dashed border-primary text-xs"
              >
                Peerlist profile
              </Link>
            </div>

            <span className="flex items-center">
              <RocketIcon className="w-4 h-4 mr-2 shrink-0" />
              Powered by Supabse, OpenAI, Nextjs, shadcn/ui and chatdocsgpt
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
