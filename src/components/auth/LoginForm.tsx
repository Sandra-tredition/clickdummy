import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Facebook, Mail, Smartphone, ArrowLeft } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);
  const { signIn, resetPassword, signInWithProvider } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Anmeldung fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError(
        "Bitte gib deine E-Mail-Adresse ein, um dein Passwort zurückzusetzen",
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setIsResetSent(true);
    } catch (err: any) {
      setError(
        err.message ||
          "E-Mail zum Zurücksetzen des Passworts konnte nicht gesendet werden",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (
    provider: "facebook" | "google" | "apple",
  ) => {
    setError(null);
    try {
      const { error } = await signInWithProvider(provider);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || `Anmeldung fehlgeschlagen mit ${provider}`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Anmelden</CardTitle>
        <CardDescription>
          Gib deine Anmeldedaten ein, um auf dein Konto zuzugreifen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right">
              <button
                type="button"
                className="text-black underline decoration-2 decoration-primary-green hover:decoration-4 transition-all text-sm"
                onClick={handlePasswordReset}
                disabled={isLoading}
              >
                Passwort vergessen?
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {isResetSent && (
            <p className="text-sm text-green-500">
              E-Mail zum Zurücksetzen des Passworts gesendet. Bitte prüfe deinen
              Posteingang.
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Anmeldung..." : "Anmelden"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Oder anmelden mit
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn("facebook")}
            >
              <div className="w-4 h-4 bg-blue-600 text-white rounded text-xs font-bold flex items-center justify-center">
                f
              </div>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn("google")}
            >
              <div className="w-4 h-4 bg-red-500 text-white rounded text-xs font-bold flex items-center justify-center">
                G
              </div>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn("apple")}
            >
              <div className="w-4 h-4 bg-black text-white rounded text-xs font-bold flex items-center justify-center">
                🍎
              </div>
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Du hast kein Konto?{" "}
          <button
            type="button"
            className="text-black underline decoration-2 decoration-primary-green hover:decoration-4 transition-all"
            onClick={() => navigate("/register")}
          >
            Jetzt registrieren
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
