import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  CreditCard,
  MapPin,
  ShoppingBag,
  Shield,
  FileText,
} from "lucide-react";
import Layout from "@/components/Layout";
import LoginDataManagement from "@/components/Account/LoginDataManagement";
import AddressManagement from "@/components/Account/AddressManagement";
import PaymentSettings from "@/components/Account/PaymentSettings";
import OrdersManagement from "@/components/Account/OrdersManagement";
import SecuritySettings from "@/components/Account/SecuritySettings";
import DocumentsManagement from "@/components/Account/DocumentsManagement";
import { useAuth } from "@/context/AuthContext";
import { useAccountVerification } from "@/hooks/useAccountVerification";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Shield as ShieldIcon, Info } from "lucide-react";

const Account = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "login",
  );

  // Check if current user is the clean user (no mock data)
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isCleanUser = currentUser?.email === "clean@example.com";

  // MFA state
  const [mfaEnabled, setMfaEnabled] = useState(false);

  // Email verification state
  const [pendingEmailVerification, setPendingEmailVerification] = useState<
    string | null
  >(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  // Bank account state
  const [bankAccount, setBankAccount] = useState({
    iban: "DE89370400440532013000",
    bankName: "Sparkasse Köln Bonn",
    accountHolder: "John Doe",
    bic: "COBADEFFXXX",
  });

  // Payout address state
  const [payoutAddress, setPayoutAddress] = useState({
    name: "John Doe",
    company: "",
    street: "Musterstraße 123",
    city: "Berlin",
    state: "Berlin",
    zip: "10115",
    country: "Deutschland",
  });

  // Address management state - empty for clean users
  const [addresses, setAddresses] = useState(
    isCleanUser
      ? []
      : [
          {
            id: "1",
            types: ["billing"],
            isDefault: { billing: true },
            name: "John Doe",
            company: "",
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "USA",
            vatId: "",
          },
          {
            id: "2",
            types: ["shipping"],
            isDefault: { shipping: true },
            name: "John Doe",
            company: "",
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "USA",
            vatId: "",
          },
          {
            id: "3",
            types: ["shipping"],
            isDefault: { shipping: false },
            name: "John Doe",
            company: "",
            street: "456 Second Ave",
            city: "Boston",
            state: "MA",
            zip: "02108",
            country: "USA",
            vatId: "",
          },
        ],
  );

  // Mock orders data - empty for clean users
  const mockOrders = isCleanUser
    ? []
    : [
        {
          id: "ORD-001",
          date: "15.10.2023",
          status: "Delivered",
          total: "129,99 €",
          itemCount: 3,
        },
        {
          id: "ORD-002",
          date: "02.11.2023",
          status: "Processing",
          total: "79,50 €",
          itemCount: 2,
        },
        {
          id: "ORD-003",
          date: "10.11.2023",
          status: "Shipped",
          total: "199,99 €",
          itemCount: 1,
        },
      ];

  // Use the account verification hook
  const {
    mfaVerificationDialog,
    mfaVerificationCode,
    setMfaVerificationCode,
    mfaVerificationError,
    requireMfaVerification,
    verifyMfaForOperation,
    cancelMfaVerification,
    passwordVerificationDialog,
    passwordVerificationInput,
    setPasswordVerificationInput,
    passwordVerificationError,
    verifyPasswordForOperation,
    cancelPasswordVerification,
  } = useAccountVerification();

  // Handler functions
  const handleEmailChange = (newEmail: string) => {
    console.log("E-Mail-Adresse ändern", newEmail);
    setPendingEmailVerification(newEmail);
    setEmailVerificationSent(true);
    console.log(`Verification email sent to ${newEmail}`);
  };

  const handlePasswordChange = (
    newPassword: string,
    confirmPassword: string,
  ) => {
    console.log("Passwort ändern");
    alert("Passwort wurde erfolgreich geändert!");
  };

  const handleCustomerDataChange = (firstName: string, lastName: string) => {
    console.log("Customer data updated:", { firstName, lastName });
  };

  const handlePublisherDataChange = (data: any) => {
    console.log("Publisher data updated:", data);
  };

  const handleVlbRegistrationChange = (
    isRegistered: boolean,
    mvbNumber: string,
  ) => {
    console.log("VLB registration updated:", { isRegistered, mvbNumber });
  };

  const handleBankAccountSave = () => {
    requireMfaVerification(
      "bank",
      () => {
        console.log("Bank account updated");
      },
      mfaEnabled,
    );
  };

  const handleAddressesChange = (newAddresses: any[]) => {
    setAddresses(newAddresses);
  };

  const resendVerificationEmail = () => {
    if (pendingEmailVerification) {
      setEmailVerificationSent(true);
      console.log(`Verification email resent to ${pendingEmailVerification}`);
    }
  };

  const cancelEmailVerification = () => {
    setPendingEmailVerification(null);
    setEmailVerificationSent(false);
  };

  return (
    <Layout
      title="Kontoeinstellungen"
      breadcrumbs={<span className="text-gray-600">Kontoeinstellungen</span>}
    >
      <div className="w-full">
        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger
              value="login"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4"
            >
              <User size={16} />
              <span className="text-xs sm:text-sm">Kontodaten</span>
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4"
            >
              <MapPin size={16} />
              <span className="text-xs sm:text-sm">Adressen</span>
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4"
            >
              <CreditCard size={16} />
              <span className="text-xs sm:text-sm">Auszahlungsdaten</span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4"
            >
              <ShoppingBag size={16} />
              <span className="text-xs sm:text-sm">Bestellungen</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4"
            >
              <Shield size={16} />
              <span className="text-xs sm:text-sm">Sicherheit</span>
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4"
            >
              <FileText size={16} />
              <span className="text-xs sm:text-sm">Dokumente</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 pt-4">
            <LoginDataManagement
              user={user}
              onEmailChange={handleEmailChange}
              onPasswordChange={handlePasswordChange}
              onCustomerDataChange={handleCustomerDataChange}
              onPublisherDataChange={handlePublisherDataChange}
              onVlbRegistrationChange={handleVlbRegistrationChange}
              pendingEmailVerification={pendingEmailVerification}
              emailVerificationSent={emailVerificationSent}
              onResendVerificationEmail={resendVerificationEmail}
              onCancelEmailVerification={cancelEmailVerification}
            />
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4 pt-4">
            <AddressManagement
              addresses={addresses}
              onAddressesChange={handleAddressesChange}
            />
          </TabsContent>

          <TabsContent value="payment" className="space-y-4 pt-4">
            <PaymentSettings
              bankAccount={bankAccount}
              setBankAccount={setBankAccount}
              payoutAddress={payoutAddress}
              setPayoutAddress={setPayoutAddress}
              onBankAccountSave={handleBankAccountSave}
            />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 pt-4">
            <OrdersManagement orders={mockOrders} />
          </TabsContent>

          <TabsContent value="security" className="space-y-4 pt-4">
            <SecuritySettings
              mfaEnabled={mfaEnabled}
              setMfaEnabled={setMfaEnabled}
            />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 pt-4">
            <DocumentsManagement />
          </TabsContent>
        </Tabs>

        {/* Password Verification Dialog for Sensitive Operations */}
        <Dialog
          open={passwordVerificationDialog.isOpen}
          onOpenChange={(open) => !open && cancelPasswordVerification()}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock size={20} className="text-blue-600" />
                Passwort-Bestätigung erforderlich
              </DialogTitle>
              <DialogDescription>
                {passwordVerificationDialog.operation === "email" &&
                  "Um deine E-Mail-Adresse zu ändern, bestätige bitte mit deinem aktuellen Passwort."}
                {passwordVerificationDialog.operation === "password" &&
                  "Um dein Passwort zu ändern, bestätige bitte mit deinem aktuellen Passwort."}
                {passwordVerificationDialog.operation === "bank" &&
                  "Um deine Bankverbindung zu ändern, bestätige bitte mit deinem aktuellen Passwort."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="password-verification-input">
                  Aktuelles Passwort
                </Label>
                <Input
                  id="password-verification-input"
                  type="password"
                  value={passwordVerificationInput}
                  onChange={(e) => {
                    setPasswordVerificationInput(e.target.value);
                  }}
                  placeholder="Gib dein aktuelles Passwort ein"
                />
                {passwordVerificationError && (
                  <p className="text-sm text-red-600">
                    {passwordVerificationError}
                  </p>
                )}
              </div>
              <Alert variant="info">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Aus Sicherheitsgründen musst du dein aktuelles Passwort
                  eingeben, um diese Änderung durchzuführen.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={cancelPasswordVerification}>
                Abbrechen
              </Button>
              <Button
                onClick={verifyPasswordForOperation}
                disabled={!passwordVerificationInput}
              >
                Bestätigen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MFA Verification Dialog for Sensitive Operations */}
        <Dialog
          open={mfaVerificationDialog.isOpen}
          onOpenChange={(open) => !open && cancelMfaVerification()}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldIcon size={20} className="text-blue-600" />
                Sicherheitsbestätigung erforderlich
              </DialogTitle>
              <DialogDescription>
                {mfaVerificationDialog.operation === "email" &&
                  "Um deine E-Mail-Adresse zu ändern, bestätige bitte mit deinem Authenticator-Code."}
                {mfaVerificationDialog.operation === "password" &&
                  "Um dein Passwort zu ändern, bestätige bitte mit deinem Authenticator-Code."}
                {mfaVerificationDialog.operation === "bank" &&
                  "Um deine Bankverbindung zu ändern, bestätige bitte mit deinem Authenticator-Code."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="mfa-verification-code">
                  Authenticator-Code
                </Label>
                <Input
                  id="mfa-verification-code"
                  value={mfaVerificationCode}
                  onChange={(e) => {
                    setMfaVerificationCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    );
                  }}
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-lg font-mono tracking-widest"
                />
                {mfaVerificationError && (
                  <p className="text-sm text-red-600">{mfaVerificationError}</p>
                )}
              </div>
              <Alert variant="info">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Gib den 6-stelligen Code aus deiner Authenticator-App ein.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={cancelMfaVerification}>
                Abbrechen
              </Button>
              <Button
                onClick={() => verifyMfaForOperation("JBSWY3DPEHPK3PXP")}
                disabled={mfaVerificationCode.length !== 6}
              >
                Bestätigen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Account;
