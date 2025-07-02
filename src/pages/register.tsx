import RegisterForm from "@/components/auth/RegisterForm";
import { Link } from "react-router-dom";

export default function RegisterPage() {
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
        <RegisterForm />
      </div>
    </div>
  );
}
