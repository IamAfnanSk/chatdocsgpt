import { Button } from "@/components/ui/button";

const LogoutButton: React.FC = () => {
  return (
    <form action="/auth/sign-out" method="post">
      <Button>Logout</Button>
    </form>
  );
};

export { LogoutButton };
