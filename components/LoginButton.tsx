"use client";

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

const LoginButton: React.FC = () => {
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <Button onClick={handleSignIn}>
      <Mail className="mr-2 h-4 w-4" /> Login with Google
    </Button>
  );
};

export { LoginButton };
