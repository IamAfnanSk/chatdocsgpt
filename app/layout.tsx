import "./globals.css";
import { Toaster } from "react-hot-toast";
import { MainNav } from "@/components/MainNav";
import Link from "next/link";

const metadata = {
  title: "chatdocsgpt",
  description: "Generate chat bots trained on docs provided by you",
};

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen max-w-4xl mx-auto bg-background flex flex-col w-full">
          <MainNav />

          <main className="flex-1">{children}</main>

          <Toaster />

          <footer className="py-14">
            <p>
              Made with ❤️ by{" "}
              <Link
                href={"https://afnan.dev?utm_source=chatdocsgpt"}
                target="_blank"
              >
                Afnan Shaikh
              </Link>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
export { metadata };
