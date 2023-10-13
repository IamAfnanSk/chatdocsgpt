"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

import { LogoutButton } from "@/components/LogoutButton";
import { LoginButton } from "@/components/LoginButton";
import { BookMarkedIcon } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const MainNav: React.FC = () => {
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
    <header className="flex items-center justify-between w-full py-4">
      <div>
        <Link className="flex items-center justify-between gap-2" href="/">
          <BookMarkedIcon />
          chatdocsgpt
        </Link>
      </div>

      <nav>
        <NavigationMenu>
          <NavigationMenuList>
            {authUser ? (
              <>
                <NavigationMenuItem>
                  <Link href="/dashboard" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Dashbaord
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <LogoutButton />

                <Avatar className="w-8 h-8">
                  <AvatarImage
                    className="rounded-full"
                    src={authUser.user_metadata.avatar_url}
                    alt={authUser.user_metadata.full_name}
                  />
                </Avatar>
              </>
            ) : (
              <LoginButton />
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </header>
  );
};

export { MainNav };
