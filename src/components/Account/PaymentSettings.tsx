import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Edit, MapPin, FileText, Info, AlertTriangle } from "lucide-react";

interface BankAccount {
  iban: string;
  bankName: string;
  accountHolder: string;
  bic: string;
}

interface PayoutAddress {
  name: string;
  company: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PaymentSettingsProps {
  bankAccount: BankAccount;
  setBankAccount: (account: BankAccount) => void;
  payoutAddress: PayoutAddress;
  setPayoutAddress: (address: PayoutAddress) => void;
  onBankAccountSave: () => void;
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({
  bankAccount,
  setBankAccount,
  payoutAddress,
  setPayoutAddress,
  onBankAccountSave,
}) => {
  // Check if current user is the clean user (no mock data)
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isCleanUser = currentUser?.email === "clean@example.com";
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [editBankForm, setEditBankForm] = useState({
    iban: "",
    accountHolder: "",
    bic: "",
  });
  const [isEditingPayoutAddress, setIsEditingPayoutAddress] = useState(false);
  const [editPayoutAddressForm, setEditPayoutAddressForm] = useState({
    name: "",
    company: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "Deutschland",
  });
  const [taxType, setTaxType] = useState<"taxNumber" | "vatId">("taxNumber");
  const [businessType, setBusinessType] = useState<
    "kleinunternehmer" | "umsatzsteuerpflichtig"
  >("kleinunternehmer");
  const [taxValue, setTaxValue] = useState("");
  const [isEditingTax, setIsEditingTax] = useState(false);
  const [editTaxForm, setEditTaxForm] = useState({
    taxType: "taxNumber" as "taxNumber" | "vatId",
    taxValue: "",
    businessType: "kleinunternehmer" as
      | "kleinunternehmer"
      | "umsatzsteuerpflichtig",
  });

  const formatIban = (iban: string) => {
    const cleanIban = iban.replace(/\s/g, "").toUpperCase();
    return cleanIban.replace(/(.{4})/g, "$1 ").trim();
  };

  const getBankNameFromIban = (iban: string): string => {
    const cleanIban = iban.replace(/\s/g, "").toUpperCase();
    const countryCode = cleanIban.substring(0, 2);

    const bankMapping: { [key: string]: string } = {
      DE37040044: "Sparkasse Köln Bonn",
      DE12500105: "Deutsche Bank",
      DE89370400: "Commerzbank",
      DE21300209: "Postbank",
      DE75512108: "DKB Deutsche Kreditbank",
    };

    for (const [code, name] of Object.entries(bankMapping)) {
      if (cleanIban.startsWith(code)) {
        return name;
      }
    }

    const countryBanks: { [key: string]: string } = {
      DE: "Deutsche Bank",
      AT: "Österreichische Bank",
      CH: "Schweizer Bank",
      FR: "Banque de France",
      IT: "Banca Italiana",
      ES: "Banco Español",
    };

    return countryBanks[countryCode] || "Unbekannte Bank";
  };

  const isBicRequired = (iban: string): boolean => {
    const cleanIban = iban.replace(/\s/g, "").toUpperCase();
    return !cleanIban.startsWith("DE");
  };

  const openEditBankDialog = () => {
    setEditBankForm({
      iban: bankAccount.iban.replace(/\s/g, ""),
      accountHolder: bankAccount.accountHolder,
      bic: bankAccount.bic || "",
    });
    setIsEditingBank(true);
  };

  const saveBankAccount = () => {
    const bankName = getBankNameFromIban(editBankForm.iban);
    setBankAccount({
      iban: editBankForm.iban,
      bankName: bankName,
      accountHolder: editBankForm.accountHolder,
      bic: editBankForm.bic,
    });
    setIsEditingBank(false);
    console.log("Bank account updated:", { ...editBankForm, bankName });
  };

  const saveBankAccountWithMfa = () => {
    onBankAccountSave();
  };

  const cancelEditBank = () => {
    setIsEditingBank(false);
    setEditBankForm({ iban: "", accountHolder: "", bic: "" });
  };

  const openEditPayoutAddressDialog = () => {
    setEditPayoutAddressForm({
      name: payoutAddress.name,
      company: payoutAddress.company || "",
      street: payoutAddress.street,
      city: payoutAddress.city,
      state: payoutAddress.state,
      zip: payoutAddress.zip,
      country: payoutAddress.country,
    });
    setIsEditingPayoutAddress(true);
  };

  const savePayoutAddress = () => {
    setPayoutAddress({ ...editPayoutAddressForm });
    setIsEditingPayoutAddress(false);
    console.log("Payout address updated:", editPayoutAddressForm);
  };

  const cancelEditPayoutAddress = () => {
    setIsEditingPayoutAddress(false);
    setEditPayoutAddressForm({
      name: "",
      company: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "Deutschland",
    });
  };

  const openEditTaxDialog = () => {
    setEditTaxForm({
      taxType: taxType,
      taxValue: taxValue,
      businessType: businessType,
    });
    setIsEditingTax(true);
  };

  const saveTaxInformation = () => {
    setTaxType(editTaxForm.taxType);
    setTaxValue(editTaxForm.taxValue);
    setBusinessType(editTaxForm.businessType);
    setIsEditingTax(false);
    console.log("Tax information updated:", editTaxForm);
  };

  const cancelEditTax = () => {
    setIsEditingTax(false);
    setEditTaxForm({
      taxType: "taxNumber",
      taxValue: "",
      businessType: "kleinunternehmer",
    });
  };

  // Check if payout data is complete
  const isPayoutDataComplete = () => {
    // For Clean Users, always consider data incomplete since they start with empty data
    if (isCleanUser) {
      return false;
    }

    const hasBankAccount = bankAccount.iban && bankAccount.accountHolder;
    const hasPayoutAddress =
      payoutAddress.name &&
      payoutAddress.street &&
      payoutAddress.city &&
      payoutAddress.zip;
    const hasTaxInfo = taxValue && taxValue.trim() !== "";

    return hasBankAccount && hasPayoutAddress && hasTaxInfo;
  };

  const payoutComplete = isPayoutDataComplete();

  return (
    <div className="bg-white space-y-4">
      <Alert variant={payoutComplete ? "info" : "warning"}>
        <Info className="h-5 w-5" />
        <AlertDescription className="text-left">
          <div className="space-y-2">
            <p className="font-medium mb-2">Informationen zu Auszahlungen</p>
            <ul className="space-y-1 text-sm">
              <li>
                • Deine Auszahlungen werden <strong>monatlich</strong>{" "}
                durchgeführt, sobald ein Mindestbetrag von{" "}
                <strong>25,00 €</strong> erreicht ist.
              </li>
              <li>
                • Die Auszahlung erfolgt per <strong>Banküberweisung</strong> an
                die von dir angegebene Bankverbindung.
              </li>
              <li>
                • Für die korrekte Abwicklung benötigen wir deine vollständigen
                Auszahlungsdaten inklusive Adresse für die Erstellung der
                Gutschrift.
              </li>
              {!payoutComplete && (
                <li className="font-medium text-amber-700">
                  • <strong>Wichtig:</strong> Provisionsgutschriften können nur
                  erstellt und ausgezahlt werden, wenn alle Angaben vollständig
                  ausgefüllt wurden.
                </li>
              )}
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            SEPA-Bankverbindung
            {(isCleanUser ||
              !bankAccount.iban ||
              !bankAccount.accountHolder) && (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
          </CardTitle>
          <CardDescription>
            Du kannst nur eine Bankverbindung für Auszahlungen hinterlegen.
          </CardDescription>
          {(isCleanUser || !bankAccount.iban || !bankAccount.accountHolder) && (
            <Alert variant="warning" className="mt-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Bankverbindung unvollständig:</strong> Bitte hinterlege
                deine IBAN und den Kontoinhaber, damit Provisionsauszahlungen
                durchgeführt werden können.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!isCleanUser && (
            <div className="relative flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                  SEPA
                </div>
                <div>
                  <p className="font-medium">
                    {formatIban(bankAccount.iban).replace(
                      /(.{4})(.*)(.{4})/,
                      "$1 **** **** $3",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Kontoinhaber: {bankAccount.accountHolder}
                  </p>
                  {bankAccount.bic && (
                    <p className="text-sm text-muted-foreground">
                      BIC: {bankAccount.bic}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isEditingBank} onOpenChange={setIsEditingBank}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openEditBankDialog}
                    >
                      <Edit size={14} className="mr-1 sm:mr-1" />
                      <span className="hidden sm:inline">Bearbeiten</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Bankverbindung ändern</DialogTitle>
                      <DialogDescription>
                        Gib eine neue SEPA-Bankverbindung ein. Diese wird für
                        alle zukünftigen Auszahlungen verwendet.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-iban">IBAN</Label>
                        <Input
                          id="edit-iban"
                          value={formatIban(editBankForm.iban)}
                          onChange={(e) => {
                            const cleanValue = e.target.value
                              .replace(/\s/g, "")
                              .toUpperCase();
                            setEditBankForm({
                              ...editBankForm,
                              iban: cleanValue,
                            });
                          }}
                          placeholder="DE89 3704 0044 0532 0130 00"
                          className="font-mono"
                        />
                      </div>
                      {editBankForm.iban &&
                        isBicRequired(editBankForm.iban) && (
                          <div className="space-y-2">
                            <Label htmlFor="edit-bic">
                              BIC <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="edit-bic"
                              value={editBankForm.bic}
                              onChange={(e) =>
                                setEditBankForm({
                                  ...editBankForm,
                                  bic: e.target.value.toUpperCase(),
                                })
                              }
                              placeholder="COBADEFFXXX"
                              className="font-mono"
                            />
                            <p className="text-sm text-muted-foreground">
                              BIC ist für Auslands-IBANs erforderlich
                            </p>
                          </div>
                        )}
                      {editBankForm.iban &&
                        !isBicRequired(editBankForm.iban) && (
                          <div className="space-y-2">
                            <Label htmlFor="edit-bic-optional">
                              BIC (optional)
                            </Label>
                            <Input
                              id="edit-bic-optional"
                              value={editBankForm.bic}
                              onChange={(e) =>
                                setEditBankForm({
                                  ...editBankForm,
                                  bic: e.target.value.toUpperCase(),
                                })
                              }
                              placeholder="COBADEFFXXX"
                              className="font-mono"
                            />
                            <p className="text-sm text-muted-foreground">
                              BIC ist für deutsche IBANs optional
                            </p>
                          </div>
                        )}
                      <div className="space-y-2">
                        <Label htmlFor="edit-account-holder">
                          Kontoinhaber
                        </Label>
                        <Input
                          id="edit-account-holder"
                          value={editBankForm.accountHolder}
                          onChange={(e) =>
                            setEditBankForm({
                              ...editBankForm,
                              accountHolder: e.target.value,
                            })
                          }
                          placeholder="Vor- und Nachname"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={cancelEditBank}>
                        Abbrechen
                      </Button>
                      <Button
                        onClick={saveBankAccountWithMfa}
                        disabled={
                          !editBankForm.iban ||
                          !editBankForm.accountHolder ||
                          (isBicRequired(editBankForm.iban) &&
                            !editBankForm.bic)
                        }
                      >
                        Speichern
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
          {isCleanUser && (
            <div className="relative flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                  SEPA
                </div>
                <div>
                  <p className="font-medium">Keine Bankverbindung hinterlegt</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isEditingBank} onOpenChange={setIsEditingBank}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openEditBankDialog}
                    >
                      <Edit size={14} className="mr-1 sm:mr-1" />
                      <span className="hidden sm:inline">Bearbeiten</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Bankverbindung hinzufügen</DialogTitle>
                      <DialogDescription>
                        Gib deine SEPA-Bankverbindung ein. Diese wird für alle
                        zukünftigen Auszahlungen verwendet.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-iban">IBAN</Label>
                        <Input
                          id="edit-iban"
                          value={formatIban(editBankForm.iban)}
                          onChange={(e) => {
                            const cleanValue = e.target.value
                              .replace(/\s/g, "")
                              .toUpperCase();
                            setEditBankForm({
                              ...editBankForm,
                              iban: cleanValue,
                            });
                          }}
                          placeholder="DE89 3704 0044 0532 0130 00"
                          className="font-mono"
                        />
                      </div>
                      {editBankForm.iban &&
                        isBicRequired(editBankForm.iban) && (
                          <div className="space-y-2">
                            <Label htmlFor="edit-bic">
                              BIC <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="edit-bic"
                              value={editBankForm.bic}
                              onChange={(e) =>
                                setEditBankForm({
                                  ...editBankForm,
                                  bic: e.target.value.toUpperCase(),
                                })
                              }
                              placeholder="COBADEFFXXX"
                              className="font-mono"
                            />
                            <p className="text-sm text-muted-foreground">
                              BIC ist für Auslands-IBANs erforderlich
                            </p>
                          </div>
                        )}
                      {editBankForm.iban &&
                        !isBicRequired(editBankForm.iban) && (
                          <div className="space-y-2">
                            <Label htmlFor="edit-bic-optional">
                              BIC (optional)
                            </Label>
                            <Input
                              id="edit-bic-optional"
                              value={editBankForm.bic}
                              onChange={(e) =>
                                setEditBankForm({
                                  ...editBankForm,
                                  bic: e.target.value.toUpperCase(),
                                })
                              }
                              placeholder="COBADEFFXXX"
                              className="font-mono"
                            />
                            <p className="text-sm text-muted-foreground">
                              BIC ist für deutsche IBANs optional
                            </p>
                          </div>
                        )}
                      <div className="space-y-2">
                        <Label htmlFor="edit-account-holder">
                          Kontoinhaber
                        </Label>
                        <Input
                          id="edit-account-holder"
                          value={editBankForm.accountHolder}
                          onChange={(e) =>
                            setEditBankForm({
                              ...editBankForm,
                              accountHolder: e.target.value,
                            })
                          }
                          placeholder="Vor- und Nachname"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={cancelEditBank}>
                        Abbrechen
                      </Button>
                      <Button
                        onClick={saveBankAccountWithMfa}
                        disabled={
                          !editBankForm.iban ||
                          !editBankForm.accountHolder ||
                          (isBicRequired(editBankForm.iban) &&
                            !editBankForm.bic)
                        }
                      >
                        Speichern
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Auszahlungsadresse
            {(isCleanUser ||
              !payoutAddress.name ||
              !payoutAddress.street ||
              !payoutAddress.city ||
              !payoutAddress.zip) && (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
          </CardTitle>
          <CardDescription>
            Diese Adresse wird auf Gutschriften für Provisionsauszahlungen
            verwendet.
          </CardDescription>
          {(isCleanUser ||
            !payoutAddress.name ||
            !payoutAddress.street ||
            !payoutAddress.city ||
            !payoutAddress.zip) && (
            <Alert variant="warning" className="mt-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Auszahlungsadresse unvollständig:</strong> Bitte
                vervollständige deine Adressdaten (Name, Straße, Stadt, PLZ),
                damit Gutschriften korrekt erstellt werden können.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!isCleanUser && (
            <div className="relative flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="font-medium">{payoutAddress.name}</p>
                  {payoutAddress.company && (
                    <p className="text-sm text-muted-foreground">
                      {payoutAddress.company}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {payoutAddress.street}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payoutAddress.zip} {payoutAddress.city}
                    {payoutAddress.state &&
                    payoutAddress.country !== "Deutschland"
                      ? `, ${payoutAddress.state}`
                      : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payoutAddress.country}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dialog
                  open={isEditingPayoutAddress}
                  onOpenChange={setIsEditingPayoutAddress}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openEditPayoutAddressDialog}
                    >
                      <Edit size={14} className="mr-1 sm:mr-1" />
                      <span className="hidden sm:inline">Bearbeiten</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Auszahlungsadresse ändern</DialogTitle>
                      <DialogDescription>
                        Gib eine neue Auszahlungsadresse ein. Diese wird für
                        alle zukünftigen Gutschriften verwendet.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-payout-name">Name</Label>
                        <Input
                          id="edit-payout-name"
                          value={editPayoutAddressForm.name}
                          onChange={(e) =>
                            setEditPayoutAddressForm({
                              ...editPayoutAddressForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Vor- und Nachname"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-payout-company">
                          Firmenname (optional)
                        </Label>
                        <Input
                          id="edit-payout-company"
                          value={editPayoutAddressForm.company}
                          onChange={(e) =>
                            setEditPayoutAddressForm({
                              ...editPayoutAddressForm,
                              company: e.target.value,
                            })
                          }
                          placeholder="Firmenname"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-payout-street">
                          Straße und Hausnummer
                        </Label>
                        <Input
                          id="edit-payout-street"
                          value={editPayoutAddressForm.street}
                          onChange={(e) =>
                            setEditPayoutAddressForm({
                              ...editPayoutAddressForm,
                              street: e.target.value,
                            })
                          }
                          placeholder="Musterstraße 123"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-payout-zip">PLZ</Label>
                          <Input
                            id="edit-payout-zip"
                            value={editPayoutAddressForm.zip}
                            onChange={(e) =>
                              setEditPayoutAddressForm({
                                ...editPayoutAddressForm,
                                zip: e.target.value,
                              })
                            }
                            placeholder="12345"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-payout-city">Stadt</Label>
                          <Input
                            id="edit-payout-city"
                            value={editPayoutAddressForm.city}
                            onChange={(e) =>
                              setEditPayoutAddressForm({
                                ...editPayoutAddressForm,
                                city: e.target.value,
                              })
                            }
                            placeholder="Musterstadt"
                          />
                        </div>
                      </div>
                      {editPayoutAddressForm.country !== "Deutschland" && (
                        <div className="space-y-2">
                          <Label htmlFor="edit-payout-state">
                            Bundesland/Staat
                          </Label>
                          <Input
                            id="edit-payout-state"
                            value={editPayoutAddressForm.state}
                            onChange={(e) =>
                              setEditPayoutAddressForm({
                                ...editPayoutAddressForm,
                                state: e.target.value,
                              })
                            }
                            placeholder="NRW"
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="edit-payout-country">Land</Label>
                        <Select
                          value={editPayoutAddressForm.country}
                          onValueChange={(value) =>
                            setEditPayoutAddressForm({
                              ...editPayoutAddressForm,
                              country: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Deutschland">
                              Deutschland
                            </SelectItem>
                            <SelectItem value="Österreich">
                              Österreich
                            </SelectItem>
                            <SelectItem value="Schweiz">Schweiz</SelectItem>
                            <SelectItem value="USA">USA</SelectItem>
                            <SelectItem value="Frankreich">
                              Frankreich
                            </SelectItem>
                            <SelectItem value="Italien">Italien</SelectItem>
                            <SelectItem value="Spanien">Spanien</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={cancelEditPayoutAddress}
                      >
                        Abbrechen
                      </Button>
                      <Button
                        onClick={savePayoutAddress}
                        disabled={
                          !editPayoutAddressForm.name ||
                          !editPayoutAddressForm.street ||
                          !editPayoutAddressForm.city ||
                          !editPayoutAddressForm.zip
                        }
                      >
                        Speichern
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
          {isCleanUser && (
            <div className="relative flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="font-medium">
                    Keine Auszahlungsadresse hinterlegt
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dialog
                  open={isEditingPayoutAddress}
                  onOpenChange={setIsEditingPayoutAddress}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openEditPayoutAddressDialog}
                    >
                      <Edit size={14} className="mr-1 sm:mr-1" />
                      <span className="hidden sm:inline">Bearbeiten</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Auszahlungsadresse hinzufügen</DialogTitle>
                      <DialogDescription>
                        Gib deine Auszahlungsadresse ein. Diese wird für alle
                        zukünftigen Gutschriften verwendet.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-payout-name">Name</Label>
                        <Input
                          id="edit-payout-name"
                          value={editPayoutAddressForm.name}
                          onChange={(e) =>
                            setEditPayoutAddressForm({
                              ...editPayoutAddressForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Vor- und Nachname"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-payout-company">
                          Firmenname (optional)
                        </Label>
                        <Input
                          id="edit-payout-company"
                          value={editPayoutAddressForm.company}
                          onChange={(e) =>
                            setEditPayoutAddressForm({
                              ...editPayoutAddressForm,
                              company: e.target.value,
                            })
                          }
                          placeholder="Firmenname"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-payout-street">
                          Straße und Hausnummer
                        </Label>
                        <Input
                          id="edit-payout-street"
                          value={editPayoutAddressForm.street}
                          onChange={(e) =>
                            setEditPayoutAddressForm({
                              ...editPayoutAddressForm,
                              street: e.target.value,
                            })
                          }
                          placeholder="Musterstraße 123"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-payout-zip">PLZ</Label>
                          <Input
                            id="edit-payout-zip"
                            value={editPayoutAddressForm.zip}
                            onChange={(e) =>
                              setEditPayoutAddressForm({
                                ...editPayoutAddressForm,
                                zip: e.target.value,
                              })
                            }
                            placeholder="12345"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-payout-city">Stadt</Label>
                          <Input
                            id="edit-payout-city"
                            value={editPayoutAddressForm.city}
                            onChange={(e) =>
                              setEditPayoutAddressForm({
                                ...editPayoutAddressForm,
                                city: e.target.value,
                              })
                            }
                            placeholder="Musterstadt"
                          />
                        </div>
                      </div>
                      {editPayoutAddressForm.country !== "Deutschland" && (
                        <div className="space-y-2">
                          <Label htmlFor="edit-payout-state">
                            Bundesland/Staat
                          </Label>
                          <Input
                            id="edit-payout-state"
                            value={editPayoutAddressForm.state}
                            onChange={(e) =>
                              setEditPayoutAddressForm({
                                ...editPayoutAddressForm,
                                state: e.target.value,
                              })
                            }
                            placeholder="NRW"
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="edit-payout-country">Land</Label>
                        <Select
                          value={editPayoutAddressForm.country}
                          onValueChange={(value) =>
                            setEditPayoutAddressForm({
                              ...editPayoutAddressForm,
                              country: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Deutschland">
                              Deutschland
                            </SelectItem>
                            <SelectItem value="Österreich">
                              Österreich
                            </SelectItem>
                            <SelectItem value="Schweiz">Schweiz</SelectItem>
                            <SelectItem value="USA">USA</SelectItem>
                            <SelectItem value="Frankreich">
                              Frankreich
                            </SelectItem>
                            <SelectItem value="Italien">Italien</SelectItem>
                            <SelectItem value="Spanien">Spanien</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={cancelEditPayoutAddress}
                      >
                        Abbrechen
                      </Button>
                      <Button
                        onClick={savePayoutAddress}
                        disabled={
                          !editPayoutAddressForm.name ||
                          !editPayoutAddressForm.street ||
                          !editPayoutAddressForm.city ||
                          !editPayoutAddressForm.zip
                        }
                      >
                        Speichern
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Steuerinformationen
            {(isCleanUser || !taxValue || taxValue.trim() === "") && (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
          </CardTitle>
          <CardDescription>
            Für einen gültigen Gutschriftsbeleg, muss entweder die Steuernummer
            oder die Umsatzsteuer-ID hinterlegt sein.
          </CardDescription>
          {(isCleanUser || !taxValue || taxValue.trim() === "") && (
            <Alert variant="warning" className="mt-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Steuerinformationen unvollständig:</strong> Bitte
                hinterlege deine Steuernummer oder Umsatzsteuer-ID, damit
                Gutschriften korrekt erstellt werden können.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                <FileText size={16} />
              </div>
              <div>
                <p className="font-medium">
                  {taxType === "taxNumber" ? "Steuernummer" : "Umsatzsteuer-ID"}
                  :{" "}
                  {isCleanUser
                    ? "Nicht hinterlegt"
                    : taxValue || "Nicht hinterlegt"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {!isCleanUser &&
                    taxType === "taxNumber" &&
                    payoutAddress.country === "Deutschland" &&
                    (businessType === "kleinunternehmer"
                      ? "Kleinunternehmer gem. § 19 UStG"
                      : "Umsatzsteuerpflichtig")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isEditingTax} onOpenChange={setIsEditingTax}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openEditTaxDialog}
                  >
                    <Edit size={14} className="mr-1 sm:mr-1" />
                    <span className="hidden sm:inline">Bearbeiten</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Steuerinformationen bearbeiten</DialogTitle>
                    <DialogDescription>
                      Aktualisiere deine Steuerinformationen für die
                      Provisionsabrechnung.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">
                        Art der Steueridentifikation
                      </Label>
                      <RadioGroup
                        value={editTaxForm.taxType}
                        onValueChange={(value: "taxNumber" | "vatId") =>
                          setEditTaxForm({ ...editTaxForm, taxType: value })
                        }
                        className="grid gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="taxNumber"
                            id="edit-taxNumber"
                          />
                          <Label htmlFor="edit-taxNumber">Steuernummer</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vatId" id="edit-vatId" />
                          <Label htmlFor="edit-vatId">Umsatzsteuer-ID</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-taxValue">
                        {editTaxForm.taxType === "taxNumber"
                          ? "Steuernummer"
                          : "Umsatzsteuer-ID"}
                      </Label>
                      <Input
                        id="edit-taxValue"
                        value={editTaxForm.taxValue}
                        onChange={(e) =>
                          setEditTaxForm({
                            ...editTaxForm,
                            taxValue: e.target.value,
                          })
                        }
                        placeholder={
                          editTaxForm.taxType === "taxNumber"
                            ? "Gib deine Steuernummer ein"
                            : "Gib deine Umsatzsteuer-ID ein"
                        }
                      />
                    </div>

                    {editTaxForm.taxType === "taxNumber" &&
                      payoutAddress.country === "Deutschland" && (
                        <div className="space-y-3">
                          <Label className="text-base font-medium">
                            Unternehmenstyp
                          </Label>
                          <RadioGroup
                            value={editTaxForm.businessType}
                            onValueChange={(
                              value:
                                | "kleinunternehmer"
                                | "umsatzsteuerpflichtig",
                            ) =>
                              setEditTaxForm({
                                ...editTaxForm,
                                businessType: value,
                              })
                            }
                            className="grid gap-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="kleinunternehmer"
                                id="edit-kleinunternehmer"
                              />
                              <Label htmlFor="edit-kleinunternehmer">
                                Kleinunternehmer gem. § 19 UStG (Erhalt der
                                Provision ohne MwSt.)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="umsatzsteuerpflichtig"
                                id="edit-umsatzsteuerpflichtig"
                              />
                              <Label htmlFor="edit-umsatzsteuerpflichtig">
                                Ich bin umsatzsteuerpflichtig (Erhalt der
                                Provision mit MwSt.)
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={cancelEditTax}>
                      Abbrechen
                    </Button>
                    <Button
                      onClick={saveTaxInformation}
                      disabled={
                        !editTaxForm.taxValue ||
                        editTaxForm.taxValue.trim() === ""
                      }
                    >
                      Steuerinformationen speichern
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSettings;
