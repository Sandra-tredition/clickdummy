import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadIcon, TrashIcon, QrCodeIcon, MoveIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface CoverTabProps {
  coverUploaded: boolean;
  coverFile: string;
  handleCoverUpload: () => void;
  setCoverUploaded: (uploaded: boolean) => void;
  setCoverFile: (file: string) => void;
}

const CoverTab: React.FC<CoverTabProps> = ({
  coverUploaded,
  coverFile,
  handleCoverUpload,
  setCoverUploaded,
  setCoverFile,
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Cover</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cover hochladen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              {!coverUploaded ? (
                <>
                  <UploadIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    Ziehen Sie Ihr Cover hierher oder klicken Sie zum
                    Durchsuchen
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Empfohlene Größe: 2500 x 3750 Pixel, JPG oder PNG
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleCoverUpload}
                  >
                    Dateien durchsuchen
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center mb-4">
                    <UploadIcon className="h-12 w-12 text-green-500" />
                  </div>
                  <p className="font-medium text-green-600">
                    Cover hochgeladen!
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {coverFile && (
                      <span>
                        Datei: {coverFile.substring(0, 20)}
                        {coverFile.length > 20 ? "..." : ""}
                      </span>
                    )}
                  </p>
                  <div className="flex gap-2 justify-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCoverUploaded(false);
                        setCoverFile("");
                      }}
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Entfernen
                    </Button>
                    <Button size="sm" onClick={handleCoverUpload}>
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Neue Version
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="bg-muted rounded-md overflow-hidden w-48 h-72 flex items-center justify-center">
                {coverUploaded ? (
                  <img
                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80"
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Cover-Vorschau
                  </p>
                )}
              </div>
              <div className="mt-4 space-y-2 w-full">
                <Label>Alternativer Text</Label>
                <Input placeholder="Beschreibung des Covers für Screenreader" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCodeIcon className="h-5 w-5" />
            Barcode platzieren
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Platzieren Sie den Barcode auf Ihrem Cover. Der Barcode wird
              automatisch generiert und auf Ihrem Cover platziert.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted rounded-md overflow-hidden w-full aspect-[2/3] flex items-center justify-center relative">
                {coverUploaded ? (
                  <>
                    <img
                      src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80"
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute bg-white border border-gray-300 p-2 cursor-move flex items-center justify-center"
                      style={{
                        width: "100px",
                        height: "50px",
                        bottom: "20px",
                        right: "20px",
                      }}
                    >
                      <MoveIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-xs text-gray-500">Barcode</span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Laden Sie zuerst ein Cover hoch
                  </p>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Barcode-Position</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs mb-1 block">Horizontal</Label>
                      <Slider
                        defaultValue={[80]}
                        max={100}
                        step={1}
                        disabled={!coverUploaded}
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Vertikal</Label>
                      <Slider
                        defaultValue={[90]}
                        max={100}
                        step={1}
                        disabled={!coverUploaded}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hintergrundfarbe</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={!coverUploaded}
                    >
                      Transparent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={!coverUploaded}
                    >
                      Weiß
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CoverTab;
