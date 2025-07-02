import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PricingTabProps {
  contentUploaded: boolean;
  minimumPrice: number;
  sellingPrice: number;
  setSellingPrice: (price: number) => void;
  authorCommission: number;
  calculateCommission: () => number;
  totalPages: number;
  priceImpact: {
    paperType: number;
    coverFinish: number;
    spineType: number;
    colorPages: number;
    format: number;
  };
}

const PricingTab: React.FC<PricingTabProps> = ({
  contentUploaded,
  minimumPrice,
  sellingPrice,
  setSellingPrice,
  authorCommission,
  calculateCommission,
  totalPages,
  priceImpact,
}) => {
  // Berechne Provisionen für beide Verkaufskanäle
  const bookstoreCommission = Math.max(0, authorCommission - 10); // Niedrigere Provision für Buchhandel
  const onlineShopCommission = authorCommission + 5; // Höhere Provision für Onlineshop
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Preisgestaltung</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verkaufspreis und Provision</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {!contentUploaded ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-700">
                  Bitte laden Sie zuerst den Buchinhalt hoch, um eine genaue
                  Preiskalkulation zu erhalten.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Verkaufspreis (€)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={sellingPrice}
                        onChange={(e) => {
                          const newPrice = parseFloat(e.target.value);
                          if (newPrice >= minimumPrice) {
                            setSellingPrice(newPrice);
                          } else {
                            setSellingPrice(minimumPrice);
                          }
                        }}
                        step="0.01"
                        min={minimumPrice}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mindestverkaufspreis: €{minimumPrice.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Autorenprovision</Label>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">
                        {authorCommission}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        (€
                        {((sellingPrice * authorCommission) / 100).toFixed(
                          2,
                        )}{" "}
                        pro Verkauf)
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Buchhandel:</span>
                        <span className="font-medium">
                          {bookstoreCommission}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Onlineshop:</span>
                        <span className="font-medium">
                          {onlineShopCommission}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Die Provision wird automatisch basierend auf Ihrem
                      Verkaufspreis berechnet.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">
                    Kostenaufstellung und Autorenprovision
                  </h3>

                  <Tabs defaultValue="bookstore" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="bookstore">Buchhandel</TabsTrigger>
                      <TabsTrigger value="onlineshop">
                        Eigener Onlineshop
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookstore" className="mt-4">
                      <div className="bg-muted rounded-md p-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Produktionskosten:</span>
                          <span>€{(minimumPrice * 0.7).toFixed(2)}</span>
                        </div>

                        <div className="pl-4 space-y-1">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>└ Papierkosten:</span>
                            <span>€{priceImpact.paperType.toFixed(2)}</span>
                          </div>

                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>└ Umschlagveredelung:</span>
                            <span>€{priceImpact.coverFinish.toFixed(2)}</span>
                          </div>

                          {priceImpact.spineType > 0 && (
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>└ Buchrücken:</span>
                              <span>€{priceImpact.spineType.toFixed(2)}</span>
                            </div>
                          )}

                          {priceImpact.format > 0 && (
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>└ Individuelles Format:</span>
                              <span>€{priceImpact.format.toFixed(2)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between">
                          <span>Plattformgebühr (10%):</span>
                          <span>€{(sellingPrice * 0.1).toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Buchhandelsrabatt (40%):</span>
                          <span>€{(sellingPrice * 0.4).toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>
                            Autorenprovision ({bookstoreCommission}%):
                          </span>
                          <span>
                            €
                            {(
                              (sellingPrice * bookstoreCommission) /
                              100
                            ).toFixed(2)}
                          </span>
                        </div>

                        <Separator className="my-2" />

                        <div className="flex justify-between font-medium">
                          <span>Netto pro Verkauf:</span>
                          <span>
                            €
                            {(
                              sellingPrice -
                              minimumPrice * 0.7 -
                              sellingPrice * 0.1 -
                              sellingPrice * 0.4 -
                              (sellingPrice * bookstoreCommission) / 100
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="onlineshop" className="mt-4">
                      <div className="bg-muted rounded-md p-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Produktionskosten:</span>
                          <span>€{(minimumPrice * 0.7).toFixed(2)}</span>
                        </div>

                        <div className="pl-4 space-y-1">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>└ Papierkosten:</span>
                            <span>€{priceImpact.paperType.toFixed(2)}</span>
                          </div>

                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>└ Umschlagveredelung:</span>
                            <span>€{priceImpact.coverFinish.toFixed(2)}</span>
                          </div>

                          {priceImpact.spineType > 0 && (
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>└ Buchrücken:</span>
                              <span>€{priceImpact.spineType.toFixed(2)}</span>
                            </div>
                          )}

                          {priceImpact.format > 0 && (
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>└ Individuelles Format:</span>
                              <span>€{priceImpact.format.toFixed(2)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between">
                          <span>Plattformgebühr (10%):</span>
                          <span>€{(sellingPrice * 0.1).toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>
                            Autorenprovision ({onlineShopCommission}%):
                          </span>
                          <span>
                            €
                            {(
                              (sellingPrice * onlineShopCommission) /
                              100
                            ).toFixed(2)}
                          </span>
                        </div>

                        <Separator className="my-2" />

                        <div className="flex justify-between font-medium">
                          <span>Netto pro Verkauf:</span>
                          <span>
                            €
                            {(
                              sellingPrice -
                              minimumPrice * 0.7 -
                              sellingPrice * 0.1 -
                              (sellingPrice * onlineShopCommission) / 100
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-medium mb-2">Preisempfehlung</h4>
                  <p className="text-sm">
                    Basierend auf Ihren Buchspezifikationen ({totalPages}{" "}
                    Seiten) und den gewählten Druckeinstellungen empfehlen wir
                    einen Verkaufspreis zwischen €{minimumPrice.toFixed(2)} und
                    €{(minimumPrice * 1.5).toFixed(2)}.
                  </p>
                  <div className="mt-3 flex gap-2">
                    {[1, 1.2, 1.5].map((factor) => {
                      const suggestedPrice =
                        Math.ceil(minimumPrice * factor * 100) / 100;
                      return (
                        <Button
                          key={factor}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSellingPrice(suggestedPrice);
                          }}
                        >
                          €{suggestedPrice.toFixed(2)}
                        </Button>
                      );
                    })}
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">
                      <strong>Hinweis:</strong> Die Autorenprovision variiert je
                      nach Verkaufskanal. Im Buchhandel beträgt sie{" "}
                      {bookstoreCommission}%, in unserem Onlineshop{" "}
                      {onlineShopCommission}%.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PricingTab;
