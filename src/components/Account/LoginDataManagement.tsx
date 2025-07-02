import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  Lock,
  Trash2,
  Info,
  MapPin,
  NotebookTabs,
  User,
} from "lucide-react";

interface User {
  email?: string;
  user_metadata?: {
    firstName?: string;
    lastName?: string;
    customerNumber?: string;
    userType?: string;
    publisherName?: string;
    publisherFirstName?: string;
    publisherLastName?: string;
    publisherStreet?: string;
    publisherPostalCode?: string;
    publisherCity?: string;
    publisherCountry?: string;
    isVlbRegistered?: boolean;
    mvbNumber?: string;
  };
}

interface LoginDataManagementProps {
  user: User | null;
  onEmailChange: (newEmail: string) => void;
  onPasswordChange: (newPassword: string, confirmPassword: string) => void;
  onCustomerDataChange: (firstName: string, lastName: string) => void;
  onPublisherDataChange: (data: any) => void;
  onVlbRegistrationChange: (isRegistered: boolean, mvbNumber: string) => void;
  pendingEmailVerification: string | null;
  emailVerificationSent: boolean;
  onResendVerificationEmail: () => void;
  onCancelEmailVerification: () => void;
}

const LoginDataManagement: React.FC<LoginDataManagementProps> = ({
  user,
  onEmailChange,
  onPasswordChange,
  onCustomerDataChange,
  onPublisherDataChange,
  onVlbRegistrationChange,
  pendingEmailVerification,
  emailVerificationSent,
  onResendVerificationEmail,
  onCancelEmailVerification,
}) => {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingCustomerData, setIsEditingCustomerData] = useState(false);
  const [isEditingPublisherData, setIsEditingPublisherData] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [customerDataForm, setCustomerDataForm] = useState({
    firstName: "",
    lastName: "",
  });
  const [publisherDataForm, setPublisherDataForm] = useState({
    publisherName: "",
    publisherFirstName: "",
    publisherLastName: "",
    publisherStreet: "",
    publisherPostalCode: "",
    publisherCity: "",
    publisherCountry: "",
  });

  const startEmailEdit = () => {
    setNewEmail(user?.email || "");
    setIsEditingEmail(true);
  };

  const cancelEmailEdit = () => {
    setIsEditingEmail(false);
    setNewEmail("");
  };

  const saveEmailChange = () => {
    if (!newEmail || newEmail === user?.email) {
      cancelEmailEdit();
      return;
    }
    onEmailChange(newEmail);
    setIsEditingEmail(false);
  };

  const startPasswordEdit = () => {
    setIsEditingPassword(true);
  };

  const cancelPasswordEdit = () => {
    setIsEditingPassword(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  const savePasswordChange = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      alert("Passwörter stimmen nicht überein!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Passwort muss mindestens 8 Zeichen lang sein!");
      return;
    }
    onPasswordChange(newPassword, confirmPassword);
    setIsEditingPassword(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  const openEditCustomerData = () => {
    setCustomerDataForm({
      firstName: user?.user_metadata?.firstName || "John",
      lastName: user?.user_metadata?.lastName || "Doe",
    });
    setIsEditingCustomerData(true);
  };

  const saveCustomerData = () => {
    onCustomerDataChange(customerDataForm.firstName, customerDataForm.lastName);
    setIsEditingCustomerData(false);
  };

  const cancelEditCustomerData = () => {
    setIsEditingCustomerData(false);
    setCustomerDataForm({ firstName: "", lastName: "" });
  };

  const openEditPublisherData = () => {
    setPublisherDataForm({
      publisherName: user?.user_metadata?.publisherName || "",
      publisherFirstName:
        user?.user_metadata?.publisherFirstName ||
        user?.user_metadata?.firstName ||
        "",
      publisherLastName:
        user?.user_metadata?.publisherLastName ||
        user?.user_metadata?.lastName ||
        "",
      publisherStreet: user?.user_metadata?.publisherStreet || "",
      publisherPostalCode: user?.user_metadata?.publisherPostalCode || "",
      publisherCity: user?.user_metadata?.publisherCity || "",
      publisherCountry: user?.user_metadata?.publisherCountry || "Deutschland",
    });
    setIsEditingPublisherData(true);
  };

  const savePublisherData = () => {
    onPublisherDataChange(publisherDataForm);
    setIsEditingPublisherData(false);
  };

  const cancelEditPublisherData = () => {
    setIsEditingPublisherData(false);
    setPublisherDataForm({
      publisherName: "",
      publisherFirstName: "",
      publisherLastName: "",
      publisherStreet: "",
      publisherPostalCode: "",
      publisherCity: "",
      publisherCountry: "",
    });
  };

  return (
    <div className="bg-white space-y-4">
      {/* Customer Number and Name Card */}
      <Card>
        <CardHeader>
          <CardTitle>Kundendaten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Kundennummer</h3>
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
                {user?.user_metadata?.customerNumber || "KD12345678"}
              </p>
              <span className="text-xs text-muted-foreground">
                Automatisch generiert
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Name</h3>
            <div className="relative flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                  <User size={16} />
                </div>
                <div>
                  <p className="font-medium">
                    {user?.user_metadata?.userType === "publisher"
                      ? `${user?.user_metadata?.publisherFirstName || user?.user_metadata?.firstName || "John"} ${user?.user_metadata?.publisherLastName || user?.user_metadata?.lastName || "Doe"}`
                      : `${user?.user_metadata?.firstName || "John"} ${user?.user_metadata?.lastName || "Doe"}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dialog
                  open={isEditingCustomerData}
                  onOpenChange={setIsEditingCustomerData}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openEditCustomerData}
                    >
                      <Edit size={14} className="mr-1 sm:mr-1" />
                      <span className="hidden sm:inline">Ändern</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Kundendaten bearbeiten</DialogTitle>
                      <DialogDescription>
                        Aktualisiere deine persönlichen Daten.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-firstName">Vorname</Label>
                        <Input
                          id="edit-firstName"
                          value={customerDataForm.firstName}
                          onChange={(e) =>
                            setCustomerDataForm({
                              ...customerDataForm,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="Vorname"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-lastName">Nachname</Label>
                        <Input
                          id="edit-lastName"
                          value={customerDataForm.lastName}
                          onChange={(e) =>
                            setCustomerDataForm({
                              ...customerDataForm,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="Nachname"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={cancelEditCustomerData}
                      >
                        Abbrechen
                      </Button>
                      <Button onClick={saveCustomerData}>
                        Änderungen speichern
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publisher Data Card - Only for publisher users */}
      {user?.user_metadata?.userType === "publisher" && (
        <Card>
          <CardHeader>
            <CardTitle>Verlagsdaten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Verlagsanschrift</h3>
              <div className="relative flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="font-medium">
                      {user?.user_metadata?.publisherName ||
                        "Muster Verlag GmbH"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.user_metadata?.publisherStreet ||
                        "Verlagsstraße 123"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.user_metadata?.publisherPostalCode || "20095"}{" "}
                      {user?.user_metadata?.publisherCity || "Hamburg"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.user_metadata?.publisherCountry || "Deutschland"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog
                    open={isEditingPublisherData}
                    onOpenChange={setIsEditingPublisherData}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openEditPublisherData}
                      >
                        <Edit size={14} className="mr-1 sm:mr-1" />
                        <span className="hidden sm:inline">Ändern</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Verlagsdaten bearbeiten</DialogTitle>
                        <DialogDescription>
                          Aktualisiere deine Verlagsinformationen.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-publisherName">
                            Verlagsname
                          </Label>
                          <Input
                            id="edit-publisherName"
                            value={publisherDataForm.publisherName}
                            onChange={(e) =>
                              setPublisherDataForm({
                                ...publisherDataForm,
                                publisherName: e.target.value,
                              })
                            }
                            placeholder="Verlagsname"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-publisherFirstName">
                              Vorname
                            </Label>
                            <Input
                              id="edit-publisherFirstName"
                              value={publisherDataForm.publisherFirstName}
                              onChange={(e) =>
                                setPublisherDataForm({
                                  ...publisherDataForm,
                                  publisherFirstName: e.target.value,
                                })
                              }
                              placeholder="Vorname"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-publisherLastName">
                              Nachname
                            </Label>
                            <Input
                              id="edit-publisherLastName"
                              value={publisherDataForm.publisherLastName}
                              onChange={(e) =>
                                setPublisherDataForm({
                                  ...publisherDataForm,
                                  publisherLastName: e.target.value,
                                })
                              }
                              placeholder="Nachname"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-publisherStreet">Straße</Label>
                          <Input
                            id="edit-publisherStreet"
                            value={publisherDataForm.publisherStreet}
                            onChange={(e) =>
                              setPublisherDataForm({
                                ...publisherDataForm,
                                publisherStreet: e.target.value,
                              })
                            }
                            placeholder="Straße und Hausnummer"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-publisherPostalCode">
                              PLZ
                            </Label>
                            <Input
                              id="edit-publisherPostalCode"
                              value={publisherDataForm.publisherPostalCode}
                              onChange={(e) =>
                                setPublisherDataForm({
                                  ...publisherDataForm,
                                  publisherPostalCode: e.target.value,
                                })
                              }
                              placeholder="PLZ"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-publisherCity">Stadt</Label>
                            <Input
                              id="edit-publisherCity"
                              value={publisherDataForm.publisherCity}
                              onChange={(e) =>
                                setPublisherDataForm({
                                  ...publisherDataForm,
                                  publisherCity: e.target.value,
                                })
                              }
                              placeholder="Stadt"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-publisherCountry">Land</Label>
                          <Input
                            id="edit-publisherCountry"
                            value={publisherDataForm.publisherCountry}
                            onChange={(e) =>
                              setPublisherDataForm({
                                ...publisherDataForm,
                                publisherCountry: e.target.value,
                              })
                            }
                            placeholder="Land"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={cancelEditPublisherData}
                        >
                          Abbrechen
                        </Button>
                        <Button onClick={savePublisherData}>
                          Änderungen speichern
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">VLB-Listung</h3>
              <div className="relative flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                    <NotebookTabs size={16} />
                  </div>
                  <div>
                    <p className="font-medium">
                      {user?.user_metadata?.isVlbRegistered
                        ? "VLB-Registriert"
                        : "Nicht registriert"}
                    </p>
                    {user?.user_metadata?.isVlbRegistered &&
                      user?.user_metadata?.mvbNumber && (
                        <p className="text-sm text-muted-foreground">
                          MVB-Kennnummer: {user.user_metadata.mvbNumber}
                        </p>
                      )}
                    {!user?.user_metadata?.isVlbRegistered && (
                      <p className="text-sm text-muted-foreground">
                        Verzeichnis lieferbarer Bücher
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user?.user_metadata?.isVlbRegistered === true ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 rounded-full hover:bg-green-100"
                    >
                      Registrierung erfolgreich
                    </Badge>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit size={14} className="mr-1 sm:mr-1" />
                          <span className="hidden sm:inline">Ändern</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>VLB-Listung</DialogTitle>
                          <DialogDescription>
                            Beauftrage uns mit der Listung ans Verzeichnis
                            lieferbarer Bücher (VLB).
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="mvb-number">MVB-Kennnummer</Label>
                            <Input
                              id="mvb-number"
                              placeholder="MVB-Kennnummer eingeben"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Die VLB-Listung ermöglicht es, dass wir deine
                              Bücher unter deiner MVB-Nummer ans VLB
                              übermitteln. Wir werden dem VLB mitteilen, dass
                              wir ab sofort die Listung für dich übernehmen.
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Abbrechen</Button>
                          <Button
                            onClick={() => {
                              onVlbRegistrationChange(true, "");
                            }}
                          >
                            VLB-Listung beantragen
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Login Data Card */}
      <Card>
        <CardHeader>
          <CardTitle>Logindaten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">E-Mail-Adresse</h3>
            <div className="relative flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                  @
                </div>
                <div>
                  <p className="font-medium">
                    {user?.email || "john.doe@example.com"}
                  </p>
                  {pendingEmailVerification && (
                    <div className="mt-2">
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800 rounded-full text-xs"
                      >
                        Verifizierung ausstehend
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Neue E-Mail: {pendingEmailVerification}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {pendingEmailVerification && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onResendVerificationEmail}
                      >
                        Link erneut senden
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onCancelEmailVerification}
                        className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        Abbrechen
                      </Button>
                    </>
                  )}
                  {!pendingEmailVerification && (
                    <Dialog
                      open={isEditingEmail}
                      onOpenChange={setIsEditingEmail}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={startEmailEdit}
                        >
                          <Edit size={14} className="mr-1 sm:mr-1" />
                          <span className="hidden sm:inline">Ändern</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>E-Mail-Adresse ändern</DialogTitle>
                          <DialogDescription>
                            Gib deine neue E-Mail-Adresse ein.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-new-email">
                              Neue E-Mail-Adresse
                            </Label>
                            <Input
                              id="edit-new-email"
                              type="email"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              placeholder="neue@email.com"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={cancelEmailEdit}>
                            Abbrechen
                          </Button>
                          <Button
                            onClick={saveEmailChange}
                            disabled={!newEmail || newEmail === user?.email}
                          >
                            Änderungen speichern
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
            {pendingEmailVerification && emailVerificationSent && (
              <Alert variant="info">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Ein Verifizierungslink wurde an{" "}
                  <strong>{pendingEmailVerification}</strong> gesendet. Bitte
                  überprüfe dein E-Mail-Postfach und klicke auf den Link, um die
                  neue E-Mail-Adresse zu bestätigen.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Passwort</h3>
            <div className="relative flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                  <Lock size={16} />
                </div>
                <div>
                  <p className="font-medium">••••••••••••</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dialog
                  open={isEditingPassword}
                  onOpenChange={setIsEditingPassword}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={startPasswordEdit}
                    >
                      <Edit size={14} className="mr-1 sm:mr-1" />
                      <span className="hidden sm:inline">Ändern</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Passwort ändern</DialogTitle>
                      <DialogDescription>
                        Gib ein neues Passwort ein.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-new-password">
                          Neues Passwort
                        </Label>
                        <Input
                          id="edit-new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Neues Passwort eingeben"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-confirm-password">
                          Passwort bestätigen
                        </Label>
                        <Input
                          id="edit-confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Passwort wiederholen"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={cancelPasswordEdit}>
                        Abbrechen
                      </Button>
                      <Button
                        onClick={savePasswordChange}
                        disabled={
                          !newPassword ||
                          !confirmPassword ||
                          newPassword !== confirmPassword
                        }
                      >
                        Änderungen speichern
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">E-Mail-Benachrichtigungen</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Ich möchte exklusive Vorteile und Updates per E-Mail erhalten.
                </p>
              </div>
              <Switch id="newsletter" defaultChecked />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Verbundene Konten</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-600 text-white rounded text-xs font-bold flex items-center justify-center">
                    f
                  </div>
                  <span>Facebook</span>
                </div>
                <Button variant="outline" size="sm">
                  Verbinden
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 text-white rounded text-xs font-bold flex items-center justify-center">
                    G
                  </div>
                  <span>Google</span>
                </div>
                <Button variant="outline" size="sm">
                  Verbinden
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-black text-white rounded text-xs font-bold flex items-center justify-center">
                    🍎
                  </div>
                  <span>Apple</span>
                </div>
                <Button variant="outline" size="sm">
                  Verbinden
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Konto löschen</CardTitle>
          <CardDescription>
            Konto und alle damit verbundenen Daten löschen. Diese Aktion kann
            nicht rückgängig gemacht werden. Veröffentlichte Buchprojekte werden
            aus dem Verkauf genommen. Sollten noch offene Provisionen vorhanden
            sein, bleibt der Zugang noch bis zum Abschluss der letzten
            Provisionsabrechung erhalten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Konto löschen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bist du sicher?</AlertDialogTitle>
                <AlertDialogDescription>
                  Nach Bestätigung wird dein Account in 14 Tagen gelöscht. Du
                  kannst die geplante Löschung jederzeit abbrechen, indem du
                  dich erneut anmeldest. Andernfalls werden alle deine Daten
                  gelöscht und können nicht wiederhergestellt werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Konto endgültig löschen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginDataManagement;
