import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Smartphone, Check, Copy, CheckCircle } from "lucide-react";
import { authenticator } from "otplib";
import QRCode from "qrcode";

interface SecuritySettingsProps {
  mfaEnabled: boolean;
  setMfaEnabled: (enabled: boolean) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  mfaEnabled,
  setMfaEnabled,
}) => {
  // Check if current user is the clean user (no mock data)
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isCleanUser = currentUser?.email === "clean@example.com";
  const [mfaSetupStep, setMfaSetupStep] = useState<"idle" | "setup" | "verify">(
    "idle",
  );
  const [totpSecret, setTotpSecret] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [secretCopied, setSecretCopied] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const generateMfaSecret = async () => {
    const mockSecret = "JBSWY3DPEHPK3PXP";
    const serviceName = "tredition";
    const accountName = "john.doe@example.com";

    const otpauthUrl = authenticator.keyuri(
      accountName,
      serviceName,
      mockSecret,
    );

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
      setTotpSecret(mockSecret);
      setQrCodeUrl(qrCodeDataUrl);
      setMfaSetupStep("setup");
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Fehler beim Generieren des QR-Codes. Bitte versuche es erneut.");
    }
  };

  const copySecretToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(totpSecret);
      setSecretCopied(true);
      setTimeout(() => setSecretCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy secret:", error);
    }
  };

  const verifyMfaCode = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError("Bitte gib einen 6-stelligen Code ein.");
      return;
    }

    const mockValidCodes = ["123456", "654321", "111111", "000000"];
    const isValid =
      mockValidCodes.includes(verificationCode) ||
      authenticator.verify({
        token: verificationCode,
        secret: totpSecret,
        window: 2,
      });

    if (isValid) {
      setMfaEnabled(true);
      setMfaSetupStep("idle");
      setVerificationCode("");
      setVerificationError("");
      console.log("MFA successfully enabled");
    } else {
      setVerificationError(
        "Ungültiger Code. Bitte versuche es erneut. (Tipp: Verwende 123456 für Demo)",
      );
    }
  };

  const cancelMfaSetup = () => {
    setMfaSetupStep("idle");
    setTotpSecret("");
    setQrCodeUrl("");
    setVerificationCode("");
    setVerificationError("");
    setSecretCopied(false);
  };

  const disableMfa = () => {
    setMfaEnabled(false);
    console.log("MFA disabled");
  };

  return (
    <div className="bg-white">
      <Card>
        <CardHeader>
          <CardTitle>Sicherheitseinstellungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">
                  Zwei-Faktor-Authentifizierung (2FA)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Erhöhe die Sicherheit deines Kontos mit einem Authenticator
                </p>
              </div>
              <div className="flex items-center gap-2">
                {mfaEnabled && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 rounded-full"
                  >
                    <CheckCircle size={12} className="mr-1" />
                    Aktiviert
                  </Badge>
                )}
                {!mfaEnabled && mfaSetupStep === "idle" && (
                  <Button
                    onClick={generateMfaSecret}
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    <Shield size={16} className="mr-1 sm:mr-2" />
                    <span className="hidden xs:inline sm:hidden">
                      Einrichten
                    </span>
                    <span className="hidden sm:inline">
                      Authenticator einrichten
                    </span>
                  </Button>
                )}
                {mfaEnabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disableMfa}
                    className="text-red-600 hover:text-red-700"
                  >
                    Deaktivieren
                  </Button>
                )}
              </div>
            </div>

            {/* MFA Setup Process */}
            {mfaSetupStep === "setup" && (
              <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Smartphone size={16} />
                  Authenticator App einrichten
                </h4>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Scanne den QR-Code mit deiner Authenticator-App (z.B. Google
                    Authenticator, Authy) oder gib das Secret manuell ein.
                  </p>

                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code für Authenticator Setup"
                        className="w-48 h-48"
                      />
                    </div>

                    <div className="w-full">
                      <Label
                        htmlFor="manual-secret"
                        className="text-sm font-medium"
                      >
                        Oder Secret manuell eingeben:
                      </Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          id="manual-secret"
                          value={totpSecret}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copySecretToClipboard}
                          className="shrink-0"
                        >
                          {secretCopied ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <Button
                      onClick={() => setMfaSetupStep("verify")}
                      className="whitespace-nowrap"
                    >
                      Weiter zur Verifikation
                    </Button>
                    <Button
                      variant="outline"
                      onClick={cancelMfaSetup}
                      className="whitespace-nowrap"
                    >
                      Abbrechen
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* MFA Verification */}
            {mfaSetupStep === "verify" && (
              <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="font-medium mb-4">
                  Authenticator-Code eingeben
                </h4>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Gib den 6-stelligen Code aus deiner Authenticator-App ein,
                    um die Einrichtung abzuschließen.
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verifikationscode</Label>
                    <Input
                      id="verification-code"
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(
                          e.target.value.replace(/\D/g, "").slice(0, 6),
                        );
                        setVerificationError("");
                      }}
                      placeholder="123456"
                      maxLength={6}
                      className="text-center text-lg font-mono tracking-widest"
                    />
                    {verificationError && (
                      <p className="text-sm text-red-600">
                        {verificationError}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={verifyMfaCode}
                      disabled={verificationCode.length !== 6}
                      className="whitespace-nowrap"
                    >
                      Verifikation abschließen
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setMfaSetupStep("setup")}
                      className="whitespace-nowrap"
                    >
                      Zurück
                    </Button>
                    <Button
                      variant="outline"
                      onClick={cancelMfaSetup}
                      className="whitespace-nowrap"
                    >
                      Abbrechen
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Aktive Sitzungen</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">New York, USA</p>
                  <p className="text-sm text-muted-foreground">
                    Heute um 14:30 Uhr • Chrome auf Windows
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 rounded-full text-xs"
                >
                  Aktuell
                </Badge>
              </div>
              {!isCleanUser && (
                <>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">London, UK</p>
                      <p className="text-sm text-muted-foreground">
                        Gestern um 11:45 Uhr • Safari auf macOS
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      Abmelden
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">San Francisco, USA</p>
                      <p className="text-sm text-muted-foreground">
                        10. Nov. 2023 um 8:15 Uhr • Firefox auf Windows
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      Abmelden
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
