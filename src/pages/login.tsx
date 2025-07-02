import LoginForm from "@/components/auth/LoginForm";
import { useLocation, Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/tredition-logo.png"
            alt="tredition"
            className="h-12 mx-auto mb-4"
          />
        </div>

        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <LoginForm />
      </div>
    </div>
  );
}
