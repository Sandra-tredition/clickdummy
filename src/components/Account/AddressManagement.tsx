import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, MapPin, Star } from "lucide-react";

interface Address {
  id: string;
  types: string[];
  isDefault: { [key: string]: boolean };
  title: string;
  name: string;
  company: string;
  street: string;
  houseNumber: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  vatId: string;
}

interface AddressManagementProps {
  addresses: Address[];
  onAddressesChange: (addresses: Address[]) => void;
}

const AddressManagement: React.FC<AddressManagementProps> = ({
  addresses,
  onAddressesChange,
}) => {
  // Check if current user is the clean user (no mock data)
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isCleanUser = currentUser?.email === "clean@example.com";
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    title: "",
    name: "",
    company: "",
    street: "",
    houseNumber: "",
    city: "",
    state: "",
    zip: "",
    country: "Deutschland",
    vatId: "",
    types: [] as string[],
    isDefault: {} as { [key: string]: boolean },
  });

  const euCountries = [
    "Deutschland",
    "Österreich",
    "Belgien",
    "Bulgarien",
    "Kroatien",
    "Zypern",
    "Tschechien",
    "Dänemark",
    "Estland",
    "Finnland",
    "Frankreich",
    "Griechenland",
    "Ungarn",
    "Irland",
    "Italien",
    "Lettland",
    "Litauen",
    "Luxemburg",
    "Malta",
    "Niederlande",
    "Polen",
    "Portugal",
    "Rumänien",
    "Slowakei",
    "Slowenien",
    "Spanien",
    "Schweden",
  ];

  const isEuCountry = (country: string) => euCountries.includes(country);

  const openAddAddressDialog = () => {
    setAddressForm({
      title: "",
      name: "",
      company: "",
      street: "",
      houseNumber: "",
      city: "",
      state: "",
      zip: "",
      country: "Deutschland",
      vatId: "",
      types: [],
      isDefault: {},
    });
    setIsAddingAddress(true);
  };

  const openEditAddressDialog = (address: Address) => {
    setAddressForm({
      title: address.title || "",
      name: address.name,
      company: address.company || "",
      street: address.street,
      houseNumber: address.houseNumber || "",
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      vatId: address.vatId || "",
      types: [...address.types],
      isDefault: { ...address.isDefault },
    });
    setEditingAddress(address.id);
  };

  const saveAddress = () => {
    if (editingAddress) {
      const updatedAddresses = addresses.map((addr) =>
        addr.id === editingAddress ? { ...addr, ...addressForm } : addr,
      );
      onAddressesChange(updatedAddresses);
      setEditingAddress(null);
    } else {
      const newAddress = {
        id: Date.now().toString(),
        ...addressForm,
      };
      onAddressesChange([...addresses, newAddress]);
      setIsAddingAddress(false);
    }

    setAddressForm({
      title: "",
      name: "",
      company: "",
      street: "",
      houseNumber: "",
      city: "",
      state: "",
      zip: "",
      country: "Deutschland",
      vatId: "",
      types: [],
      isDefault: {},
    });
  };

  const cancelAddressDialog = () => {
    setIsAddingAddress(false);
    setEditingAddress(null);
    setAddressForm({
      title: "",
      name: "",
      company: "",
      street: "",
      houseNumber: "",
      city: "",
      state: "",
      zip: "",
      country: "Deutschland",
      vatId: "",
      types: [],
      isDefault: {},
    });
  };

  const deleteAddress = (addressId: string) => {
    onAddressesChange(addresses.filter((addr) => addr.id !== addressId));
  };

  const handleAddressTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setAddressForm({
        ...addressForm,
        types: [...addressForm.types, type],
        isDefault: { ...addressForm.isDefault, [type]: false },
      });
    } else {
      const newTypes = addressForm.types.filter((t) => t !== type);
      const newIsDefault = { ...addressForm.isDefault };
      delete newIsDefault[type];
      setAddressForm({
        ...addressForm,
        types: newTypes,
        isDefault: newIsDefault,
      });
    }
  };

  const handleDefaultChange = (type: string, isDefault: boolean) => {
    setAddressForm({
      ...addressForm,
      isDefault: { ...addressForm.isDefault, [type]: isDefault },
    });
  };

  const getTypeLabels = (types: string[]) => {
    const labels: { [key: string]: string } = {
      billing: "Rechnungsadresse",
      shipping: "Lieferadresse",
    };
    return types.map((type) => labels[type] || type);
  };

  return (
    <div className="bg-white">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Adressverwaltung</CardTitle>
          <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={openAddAddressDialog}
                className="whitespace-nowrap"
              >
                <Plus size={16} className="mr-1 sm:mr-2" />
                <span className="hidden xs:inline sm:hidden">Hinzufügen</span>
                <span className="hidden sm:inline">
                  Neue Adresse hinzufügen
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Neue Adresse hinzufügen</DialogTitle>
                <DialogDescription>
                  Gib die Details für die neue Adresse ein.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="add-title">Titel (optional)</Label>
                  <Input
                    id="add-title"
                    value={addressForm.title}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, title: e.target.value })
                    }
                    placeholder="Dr., Prof., etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-name">Name</Label>
                  <Input
                    id="add-name"
                    value={addressForm.name}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, name: e.target.value })
                    }
                    placeholder="Vor- und Nachname"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-company">Firmenname (optional)</Label>
                  <Input
                    id="add-company"
                    value={addressForm.company}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        company: e.target.value,
                      })
                    }
                    placeholder="Firmenname"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="add-street">Straße</Label>
                    <Input
                      id="add-street"
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          street: e.target.value,
                        })
                      }
                      placeholder="Musterstraße"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-house-number">Hausnummer</Label>
                    <Input
                      id="add-house-number"
                      value={addressForm.houseNumber}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          houseNumber: e.target.value,
                        })
                      }
                      placeholder="123"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-zip">PLZ</Label>
                    <Input
                      id="add-zip"
                      value={addressForm.zip}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, zip: e.target.value })
                      }
                      placeholder="12345"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-city">Stadt</Label>
                    <Input
                      id="add-city"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      placeholder="Musterstadt"
                    />
                  </div>
                </div>
                {addressForm.country !== "Deutschland" && (
                  <div className="space-y-2">
                    <Label htmlFor="add-state">Bundesland/Staat</Label>
                    <Input
                      id="add-state"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          state: e.target.value,
                        })
                      }
                      placeholder="NRW"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="add-country">Land</Label>
                  <Select
                    value={addressForm.country}
                    onValueChange={(value) =>
                      setAddressForm({ ...addressForm, country: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Deutschland">Deutschland</SelectItem>
                      <SelectItem value="Österreich">Österreich</SelectItem>
                      <SelectItem value="Schweiz">Schweiz</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="Frankreich">Frankreich</SelectItem>
                      <SelectItem value="Italien">Italien</SelectItem>
                      <SelectItem value="Spanien">Spanien</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {isEuCountry(addressForm.country) &&
                  addressForm.country !== "Deutschland" && (
                    <div className="space-y-2">
                      <Label htmlFor="add-vatId">
                        Umsatzsteuer-ID (optional)
                      </Label>
                      <Input
                        id="add-vatId"
                        value={addressForm.vatId}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            vatId: e.target.value,
                          })
                        }
                        placeholder="DE123456789"
                      />
                    </div>
                  )}
                <div className="space-y-3">
                  <Label>Standard-Adressen</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="add-billing-default"
                        checked={addressForm.isDefault.billing || false}
                        onCheckedChange={(checked) => {
                          handleDefaultChange("billing", checked as boolean);
                          if (
                            checked &&
                            !addressForm.types.includes("billing")
                          ) {
                            setAddressForm({
                              ...addressForm,
                              types: [...addressForm.types, "billing"],
                              isDefault: {
                                ...addressForm.isDefault,
                                billing: true,
                              },
                            });
                          }
                        }}
                      />
                      <Label htmlFor="add-billing-default">
                        Standard-Rechnungsadresse
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="add-shipping-default"
                        checked={addressForm.isDefault.shipping || false}
                        onCheckedChange={(checked) => {
                          handleDefaultChange("shipping", checked as boolean);
                          if (
                            checked &&
                            !addressForm.types.includes("shipping")
                          ) {
                            setAddressForm({
                              ...addressForm,
                              types: [...addressForm.types, "shipping"],
                              isDefault: {
                                ...addressForm.isDefault,
                                shipping: true,
                              },
                            });
                          }
                        }}
                      />
                      <Label htmlFor="add-shipping-default">
                        Standard-Lieferadresse
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={cancelAddressDialog}>
                  Abbrechen
                </Button>
                <Button
                  onClick={saveAddress}
                  disabled={
                    !addressForm.name ||
                    !addressForm.street ||
                    !addressForm.houseNumber ||
                    !addressForm.city ||
                    !addressForm.zip ||
                    (!addressForm.isDefault.billing &&
                      !addressForm.isDefault.shipping)
                  }
                >
                  Adresse hinzufügen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {addresses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">Keine Adressen hinterlegt</p>
                <p className="text-sm mb-6">
                  {isCleanUser
                    ? "Füge deine erste Adresse hinzu, um Rechnungs- und Lieferadressen zu verwalten."
                    : "Du hast noch keine Adressen gespeichert."}
                </p>
                <Button variant="outline" onClick={openAddAddressDialog}>
                  <Plus size={16} className="mr-2" />
                  {isCleanUser
                    ? "Erste Adresse hinzufügen"
                    : "Adresse hinzufügen"}
                </Button>
              </div>
            )}
            {addresses.map((address) => (
              <div
                key={address.id}
                className="relative flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-4"
              >
                <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="flex h-10 w-12 sm:w-16 items-center justify-center rounded bg-slate-100 flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{address.name}</p>
                    {address.company && (
                      <p className="text-sm text-muted-foreground truncate">
                        {address.company}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground truncate">
                      {address.street} {address.houseNumber}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {address.zip} {address.city}
                      {address.state && address.country !== "Deutschland"
                        ? `, ${address.state}`
                        : ""}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {address.country}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2 sm:hidden">
                      {address.types
                        .filter((type) => address.isDefault[type])
                        .map((type) => {
                          const label =
                            type === "billing"
                              ? "Standard-Rechnungsadresse"
                              : "Standard-Lieferadresse";
                          return (
                            <Badge
                              key={type}
                              variant="secondary"
                              className={`text-xs rounded-full ${
                                type === "billing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {label}
                              <Star size={10} className="ml-1 fill-current" />
                            </Badge>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                  <div className="hidden sm:flex flex-col gap-1 items-end mr-2">
                    {address.types
                      .filter((type) => address.isDefault[type])
                      .map((type) => {
                        const label =
                          type === "billing"
                            ? "Standard-Rechnungsadresse"
                            : "Standard-Lieferadresse";
                        return (
                          <Badge
                            key={type}
                            variant="secondary"
                            className={`text-xs rounded-full ${
                              type === "billing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {label}
                            <Star size={10} className="ml-1 fill-current" />
                          </Badge>
                        );
                      })}
                  </div>
                  <Dialog
                    open={editingAddress === address.id}
                    onOpenChange={(open) => !open && setEditingAddress(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditAddressDialog(address)}
                      >
                        <Edit size={14} className="mr-1 sm:mr-1" />
                        <span className="hidden sm:inline">Bearbeiten</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Adresse bearbeiten</DialogTitle>
                        <DialogDescription>
                          Ändere die Details der Adresse.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Titel (optional)</Label>
                          <Input
                            id="edit-title"
                            value={addressForm.title}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                title: e.target.value,
                              })
                            }
                            placeholder="Dr., Prof., etc."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Name</Label>
                          <Input
                            id="edit-name"
                            value={addressForm.name}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                name: e.target.value,
                              })
                            }
                            placeholder="Vor- und Nachname"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-company">
                            Firmenname (optional)
                          </Label>
                          <Input
                            id="edit-company"
                            value={addressForm.company}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                company: e.target.value,
                              })
                            }
                            placeholder="Firmenname"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="edit-street">Straße</Label>
                            <Input
                              id="edit-street"
                              value={addressForm.street}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  street: e.target.value,
                                })
                              }
                              placeholder="Musterstraße"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-house-number">
                              Hausnummer
                            </Label>
                            <Input
                              id="edit-house-number"
                              value={addressForm.houseNumber}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  houseNumber: e.target.value,
                                })
                              }
                              placeholder="123"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-zip">PLZ</Label>
                            <Input
                              id="edit-zip"
                              value={addressForm.zip}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  zip: e.target.value,
                                })
                              }
                              placeholder="12345"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-city">Stadt</Label>
                            <Input
                              id="edit-city"
                              value={addressForm.city}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  city: e.target.value,
                                })
                              }
                              placeholder="Musterstadt"
                            />
                          </div>
                        </div>
                        {addressForm.country !== "Deutschland" && (
                          <div className="space-y-2">
                            <Label htmlFor="edit-state">Bundesland/Staat</Label>
                            <Input
                              id="edit-state"
                              value={addressForm.state}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  state: e.target.value,
                                })
                              }
                              placeholder="NRW"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="edit-country">Land</Label>
                          <Select
                            value={addressForm.country}
                            onValueChange={(value) =>
                              setAddressForm({ ...addressForm, country: value })
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
                        {isEuCountry(addressForm.country) &&
                          addressForm.country !== "Deutschland" && (
                            <div className="space-y-2">
                              <Label htmlFor="edit-vatId">
                                Umsatzsteuer-ID (optional)
                              </Label>
                              <Input
                                id="edit-vatId"
                                value={addressForm.vatId}
                                onChange={(e) =>
                                  setAddressForm({
                                    ...addressForm,
                                    vatId: e.target.value,
                                  })
                                }
                                placeholder="DE123456789"
                              />
                            </div>
                          )}
                        <div className="space-y-3">
                          <Label>Standard-Adressen</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="edit-billing-default"
                                checked={addressForm.isDefault.billing || false}
                                onCheckedChange={(checked) => {
                                  handleDefaultChange(
                                    "billing",
                                    checked as boolean,
                                  );
                                  if (
                                    checked &&
                                    !addressForm.types.includes("billing")
                                  ) {
                                    setAddressForm({
                                      ...addressForm,
                                      types: [...addressForm.types, "billing"],
                                      isDefault: {
                                        ...addressForm.isDefault,
                                        billing: true,
                                      },
                                    });
                                  }
                                }}
                              />
                              <Label htmlFor="edit-billing-default">
                                Standard-Rechnungsadresse
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="edit-shipping-default"
                                checked={
                                  addressForm.isDefault.shipping || false
                                }
                                onCheckedChange={(checked) => {
                                  handleDefaultChange(
                                    "shipping",
                                    checked as boolean,
                                  );
                                  if (
                                    checked &&
                                    !addressForm.types.includes("shipping")
                                  ) {
                                    setAddressForm({
                                      ...addressForm,
                                      types: [...addressForm.types, "shipping"],
                                      isDefault: {
                                        ...addressForm.isDefault,
                                        shipping: true,
                                      },
                                    });
                                  }
                                }}
                              />
                              <Label htmlFor="edit-shipping-default">
                                Standard-Lieferadresse
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={cancelAddressDialog}>
                          Abbrechen
                        </Button>
                        <Button
                          onClick={saveAddress}
                          disabled={
                            !addressForm.name ||
                            !addressForm.street ||
                            !addressForm.houseNumber ||
                            !addressForm.city ||
                            !addressForm.zip ||
                            (!addressForm.isDefault.billing &&
                              !addressForm.isDefault.shipping)
                          }
                        >
                          Änderungen speichern
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 whitespace-nowrap"
                      >
                        <Trash2 size={14} className="mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Löschen</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Adresse löschen</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bist du sicher, dass du diese Adresse löschen
                          möchtest? Diese Aktion kann nicht rückgängig gemacht
                          werden.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => deleteAddress(address.id)}
                        >
                          Löschen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressManagement;
