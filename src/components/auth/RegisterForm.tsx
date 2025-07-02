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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Facebook,
  Mail,
  Smartphone,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterForm() {
  // Step management
  const [currentStep, setCurrentStep] = useState<
    "registration" | "verification" | "details"
  >("registration");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Step 1: Registration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  // Step 2: User type and details
  const [userType, setUserType] = useState<"person" | "publisher">("person");
  const [socialTermsAccepted, setSocialTermsAccepted] = useState(false);

  // Person details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Publisher details
  const [publisherName, setPublisherName] = useState("");
  const [publisherFirstName, setPublisherFirstName] = useState("");
  const [publisherLastName, setPublisherLastName] = useState("");
  const [publisherStreet, setPublisherStreet] = useState("");
  const [publisherCity, setPublisherCity] = useState("");
  const [publisherPostalCode, setPublisherPostalCode] = useState("");
  const [publisherCountry, setPublisherCountry] = useState("Deutschland");
  const [isVlbRegistered, setIsVlbRegistered] = useState(false);
  const [mvbNumber, setMvbNumber] = useState("");

  const { signUp, signInWithProvider } = useAuth();
  const navigate = useNavigate();

  const handleInitialRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    if (!termsAccepted) {
      setError("Du musst die Allgemeinen Geschäftsbedingungen akzeptieren");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentStep("verification");
    } catch (err: any) {
      setError(err.message || "Registrierung fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = () => {
    // Simulate email verification
    setIsEmailVerified(true);
    setCurrentStep("details");
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check if terms are accepted for social login users
    if (!termsAccepted && !socialTermsAccepted) {
      setError("Du musst die Allgemeinen Geschäftsbedingungen akzeptieren");
      return;
    }

    // Validate required fields based on user type
    if (userType === "person") {
      if (!firstName || !lastName) {
        setError("Bitte gib deinen Vor- und Nachnamen ein");
        return;
      }
    } else {
      if (
        !publisherName ||
        !publisherFirstName ||
        !publisherLastName ||
        !publisherStreet ||
        !publisherCity ||
        !publisherPostalCode
      ) {
        setError("Bitte fülle alle Pflichtfelder aus");
        return;
      }
      if (isVlbRegistered && !mvbNumber) {
        setError("Bitte gib deine MVB-Kennnummer ein");
        return;
      }
    }

    setIsLoading(true);

    try {
      const customerNumber = `KD${Math.random().toString().substr(2, 8)}`;

      const userData = {
        email,
        userType,
        customerNumber,
        ...(userType === "person"
          ? {
              firstName,
              lastName,
            }
          : {
              publisherName,
              publisherFirstName,
              publisherLastName,
              publisherStreet,
              publisherCity,
              publisherPostalCode,
              publisherCountry,
              isVlbRegistered,
              mvbNumber: isVlbRegistered ? mvbNumber : null,
            }),
        communicationPreferences: {
          newsletter,
        },
      };

      const { error } = await signUp(email, password, userData);
      if (error) throw error;

      navigate("/dashboard", {
        state: {
          message: `Willkommen! Ihre Kundennummer ist: ${customerNumber}`,
        },
      });
    } catch (err: any) {
      setError(err.message || "Registrierung fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (
    provider: "facebook" | "google" | "apple",
  ) => {
    setError(null);
    try {
      const { error } = await signInWithProvider(provider);
      if (error) throw error;
      // After social login, go directly to details step
      setCurrentStep("details");
      setIsEmailVerified(true);
      // Reset terms acceptance for social login
      setSocialTermsAccepted(false);
    } catch (err: any) {
      setError(err.message || `Anmeldung mit ${provider} fehlgeschlagen`);
    }
  };

  // Step 1: Initial Registration
  if (currentStep === "registration") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Konto erstellen</CardTitle>
          <CardDescription>
            Gib deine Daten ein, um ein neues Konto zu erstellen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInitialRegistration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.de"
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Separator className="my-4" />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                checked={newsletter}
                onCheckedChange={(checked) => setNewsletter(checked === true)}
              />
              <Label htmlFor="newsletter" className="text-sm font-normal">
                Ich möchte über neue Funktionen und exklusive Vorteile per
                E-Mail informiert werden. Meine Einwilligung kann ich jederzeit
                widerrufen.
              </Label>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) =>
                  setTermsAccepted(checked === true)
                }
                required
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                Ich stimme den{" "}
                <button
                  type="button"
                  className="text-black underline decoration-2 decoration-primary-green hover:decoration-4 transition-all text-sm"
                  onClick={(e) => e.preventDefault()}
                >
                  Allgemeinen Geschäftsbedingungen
                </button>{" "}
                zu
              </Label>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Konto wird erstellt..." : "Registrieren"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Oder registrieren mit
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialSignUp("facebook")}
              >
                <div className="w-4 h-4 bg-blue-600 text-white rounded text-xs font-bold flex items-center justify-center">
                  f
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialSignUp("google")}
              >
                <div className="w-4 h-4 bg-red-500 text-white rounded text-xs font-bold flex items-center justify-center">
                  G
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialSignUp("apple")}
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
            Du hast ein Konto?{" "}
            <button
              type="button"
              className="text-black underline decoration-2 decoration-primary-green hover:decoration-4 transition-all"
              onClick={() => navigate("/login")}
            >
              Jetzt anmelden
            </button>
          </p>
        </CardFooter>
      </Card>
    );
  }

  // Step 2: Email Verification
  if (currentStep === "verification") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>E-Mail bestätigen</CardTitle>
          <CardDescription>
            Wir haben dir eine E-Mail an {email} gesendet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <Alert variant="info">
              <AlertDescription className="text-left">
                Klicke auf den Link in der E-Mail, um deine E-Mail-Adresse zu
                bestätigen. Keine E-Mail erhalten? Überprüfe deinen Spam-Ordner.
              </AlertDescription>
            </Alert>

            {/* Simulate verification for demo */}
            <Button
              onClick={handleEmailVerification}
              className="w-full"
              variant="outline"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              E-Mail als bestätigt markieren (Demo)
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setCurrentStep("registration")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Step 3: User Details
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Kontotyp wählen</CardTitle>
        <CardDescription>
          Wenn du ein Verlag bist und mit eigenen ISBNs veröffentlichen
          möchtest, registriere dich als "Verlag". Ansonsten wähle
          "Privatperson" aus. Dann bekommst du die ISBNs von tredition.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCompleteRegistration} className="space-y-6">
          {/* User Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Ich registriere mich als:
            </Label>
            <RadioGroup
              value={userType}
              onValueChange={(value: "person" | "publisher") =>
                setUserType(value)
              }
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="person" id="person" />
                <Label htmlFor="person" className="font-normal cursor-pointer">
                  Privatperson
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="publisher" id="publisher" />
                <Label
                  htmlFor="publisher"
                  className="font-normal cursor-pointer"
                >
                  Verlag
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Person Details */}
          {userType === "person" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Persönliche Daten</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Vorname</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nachname</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Terms acceptance for social login users */}
              {isEmailVerified && !termsAccepted && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="socialTerms"
                      checked={socialTermsAccepted}
                      onCheckedChange={(checked) =>
                        setSocialTermsAccepted(checked === true)
                      }
                      required
                    />
                    <Label
                      htmlFor="socialTerms"
                      className="text-sm font-normal"
                    >
                      Ich stimme den{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.preventDefault()}
                      >
                        Allgemeinen Geschäftsbedingungen
                      </Button>{" "}
                      zu
                    </Label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Publisher Details */}
          {userType === "publisher" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Verlagsdaten</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="publisherName">Verlagsname</Label>
                  <Input
                    id="publisherName"
                    value={publisherName}
                    onChange={(e) => setPublisherName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publisherFirstName">Vorname</Label>
                    <Input
                      id="publisherFirstName"
                      value={publisherFirstName}
                      onChange={(e) => setPublisherFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publisherLastName">Nachname</Label>
                    <Input
                      id="publisherLastName"
                      value={publisherLastName}
                      onChange={(e) => setPublisherLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Adresse</h4>
                <div className="space-y-2">
                  <Label htmlFor="publisherStreet">Straße und Hausnummer</Label>
                  <Input
                    id="publisherStreet"
                    value={publisherStreet}
                    onChange={(e) => setPublisherStreet(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publisherPostalCode">PLZ</Label>
                    <Input
                      id="publisherPostalCode"
                      value={publisherPostalCode}
                      onChange={(e) => setPublisherPostalCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="publisherCity">Stadt</Label>
                    <Input
                      id="publisherCity"
                      value={publisherCity}
                      onChange={(e) => setPublisherCity(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publisherCountry">Land</Label>
                  <Select
                    value={publisherCountry}
                    onValueChange={setPublisherCountry}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Deutschland">Deutschland</SelectItem>
                      <SelectItem value="Österreich">Österreich</SelectItem>
                      <SelectItem value="Schweiz">Schweiz</SelectItem>
                      <SelectItem value="Andere">Andere</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">VLB-Registrierung</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vlbRegistered"
                    checked={isVlbRegistered}
                    onCheckedChange={(checked) =>
                      setIsVlbRegistered(checked === true)
                    }
                  />
                  <Label
                    htmlFor="vlbRegistered"
                    className="text-sm font-normal"
                  >
                    Wir sind im VLB (Verzeichnis lieferbarer Bücher) registriert
                  </Label>
                </div>

                {isVlbRegistered && (
                  <div className="space-y-2">
                    <Label htmlFor="mvbNumber">MVB-Kennnummer</Label>
                    <Input
                      id="mvbNumber"
                      value={mvbNumber}
                      onChange={(e) => setMvbNumber(e.target.value)}
                      placeholder="z.B. 12345"
                      required={isVlbRegistered}
                    />
                    <p className="text-xs text-muted-foreground">
                      Die MVB-Kennnummer findest du in deinen VLB-Unterlagen
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep("verification")}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading
                ? "Wird abgeschlossen..."
                : "Registrierung abschließen"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
