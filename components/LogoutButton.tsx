import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action="/auth/sign-out" method="post">
      <Button>Logout</Button>
    </form>
  );
}
