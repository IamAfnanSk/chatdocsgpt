import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "chatdocsgpt",
  description: "Generate chat bots trained on docs provided by you",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-background flex flex-col items-center">
          {children}

          <Toaster />
        </main>
      </body>
    </html>
  );
}
