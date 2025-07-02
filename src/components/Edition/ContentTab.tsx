import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpenIcon,
  UploadIcon,
  TrashIcon,
  FileIcon,
  AlertTriangleIcon,
} from "lucide-react";

// Buchformate mit ihren Abmessungen
const bookFormats = {
  A4: { width: 210, height: 297, name: "A4 (210 × 297 mm)" },
  A5: { width: 148, height: 210, name: "A5 (148 × 210 mm)" },
  B5: { width: 176, height: 250, name: "B5 (176 × 250 mm)" },
  Royal: { width: 156, height: 234, name: "Royal (156 × 234 mm)" },
  "US-Letter": { width: 216, height: 279, name: "US Letter (216 × 279 mm)" },
  "US-Trade": { width: 152, height: 229, name: "US Trade (152 × 229 mm)" },
  Quadratisch: { width: 210, height: 210, name: "Quadratisch (210 × 210 mm)" },
  Individuell: { width: 0, height: 0, name: "Individuelles Format" },
};

// Druckeinstellungen
const paperTypes = [
  { value: "textdruck-weiss", label: "Textdruck weiß", pricePerPage: 0.02 },
  {
    value: "textdruck-cremeweiss",
    label: "Textdruck cremeweiß",
    pricePerPage: 0.025,
  },
  {
    value: "bilderdruck-weiss",
    label: "Bilderdruck weiß",
    pricePerPage: 0.035,
  },
];

const coverFinishes = [
  { value: "matt", label: "Matt", price: 0.5 },
  { value: "glaenzend", label: "Glänzend", price: 0.7 },
];

const spineTypes = [
  { value: "rund", label: "Rund", price: 0.3 },
  { value: "gerade", label: "Gerade", price: 0 },
];

interface ContentTabProps {
  contentUploaded: boolean;
  selectedFormat: string;
  selectedPaperType: string;
  selectedCoverFinish: string;
  selectedSpineType: string;
  customWidth: string;
  customHeight: string;
  customFormatError: string;
  setCustomWidth: (width: string) => void;
  setCustomHeight: (height: string) => void;
  validateCustomFormat: () => boolean;
  handleContentUpload: () => void;
  setContentUploaded: (uploaded: boolean) => void;
  setContentFile: (file: string) => void;
  setTotalPages: (pages: number) => void;
  setColorPages: (pages: number[]) => void;
  formatError: string;
  contentFile: string;
  totalPages: number;
  priceImpact: {
    paperType: number;
    coverFinish: number;
    spineType: number;
    colorPages: number;
    format: number;
  };
  minimumPrice: number;
  enableSampleReading: boolean;
  setEnableSampleReading: (enable: boolean) => void;
}

const ContentTab: React.FC<ContentTabProps> = ({
  contentUploaded,
  selectedFormat,
  selectedPaperType,
  selectedCoverFinish,
  selectedSpineType,
  customWidth,
  customHeight,
  customFormatError,
  setCustomWidth,
  setCustomHeight,
  validateCustomFormat,
  handleContentUpload,
  setContentUploaded,
  setContentFile,
  setTotalPages,
  setColorPages,
  formatError,
  contentFile,
  totalPages,
  priceImpact,
  minimumPrice,
  enableSampleReading,
  setEnableSampleReading,
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Buchinhalt</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buchformat wählen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentUploaded && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-blue-500 font-bold">Hinweis:</div>
                  <div>
                    Ihre Druckeinstellungen beeinflussen direkt den
                    Mindestverkaufspreis.
                  </div>
                </div>
                <div className="text-sm mt-1">
                  Aktuelle Kalkulation: {minimumPrice.toFixed(2)} €
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="book-format">Format</Label>
              <Select
                value={selectedFormat}
                onValueChange={(value) => {
                  // This would need to be handled in the parent component
                  // We're just showing the UI here
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Format auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(bookFormats).map(([key, format]) => (
                    <SelectItem key={key} value={key}>
                      {format.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Die PDF-Datei muss exakt diesem Format entsprechen.
              </p>

              {selectedFormat === "Individuell" && (
                <div className="mt-4 border rounded-md p-4 space-y-4">
                  <h4 className="font-medium">Individuelles Format</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="custom-width">Breite (cm)</Label>
                      <Input
                        id="custom-width"
                        type="text"
                        value={customWidth}
                        onChange={(e) => {
                          setCustomWidth(e.target.value);
                          validateCustomFormat();
                        }}
                        placeholder="z.B. 15,0"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Min: 10,8 cm, Max: 21 cm
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="custom-height">Höhe (cm)</Label>
                      <Input
                        id="custom-height"
                        type="text"
                        value={customHeight}
                        onChange={(e) => {
                          setCustomHeight(e.target.value);
                          validateCustomFormat();
                        }}
                        placeholder="z.B. 21,0"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Min: 17 cm, Max: 29,7 cm
                      </p>
                    </div>
                  </div>
                  {customFormatError && (
                    <p className="text-sm text-red-500">{customFormatError}</p>
                  )}
                  <div className="bg-amber-50 p-3 rounded-md text-sm">
                    <p>
                      Hinweis: Individuelle Formate erhöhen den Mindestpreis um
                      1,50 €.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <Label htmlFor="paper-type">Papiersorte</Label>
              <Select value={selectedPaperType} onValueChange={() => {}}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Papiersorte auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {paperTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {contentUploaded && priceImpact.paperType > 0 && (
                <div className="absolute right-0 top-0 text-sm text-blue-600 font-medium">
                  +{priceImpact.paperType.toFixed(2)} €
                </div>
              )}
            </div>

            <div className="relative">
              <Label htmlFor="cover-finish">Umschlagveredelung</Label>
              <Select value={selectedCoverFinish} onValueChange={() => {}}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Veredelung auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {coverFinishes.map((finish) => (
                    <SelectItem key={finish.value} value={finish.value}>
                      {finish.label} (+{finish.price.toFixed(2)} €)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {contentUploaded && priceImpact.coverFinish > 0 && (
                <div className="absolute right-0 top-0 text-sm text-blue-600 font-medium">
                  +{priceImpact.coverFinish.toFixed(2)} €
                </div>
              )}
            </div>

            <div className="relative">
              <Label htmlFor="spine-type">Buchrücken</Label>
              <Select value={selectedSpineType} onValueChange={() => {}}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Buchrücken auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {spineTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}{" "}
                      {type.price > 0 ? `(+${type.price.toFixed(2)} €)` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {contentUploaded && priceImpact.spineType > 0 && (
                <div className="absolute right-0 top-0 text-sm text-blue-600 font-medium">
                  +{priceImpact.spineType.toFixed(2)} €
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buchinhalt hochladen</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            {!contentUploaded ? (
              <>
                <UploadIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  Ziehen Sie Ihre PDF-Datei hierher oder klicken Sie zum
                  Durchsuchen
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Nur PDF-Dateien im Format {bookFormats[selectedFormat].name}{" "}
                  werden unterstützt
                </p>
                {formatError && (
                  <div className="mt-2 flex items-center justify-center text-amber-500">
                    <AlertTriangleIcon className="h-4 w-4 mr-1" />
                    <p className="text-sm">{formatError}</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleContentUpload}
                >
                  Dateien durchsuchen
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center mb-4">
                  <FileIcon className="h-12 w-12 text-green-500" />
                </div>
                <p className="font-medium text-green-600">PDF hochgeladen!</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {totalPages} Seiten erkannt
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {contentFile && (
                    <span>
                      Datei: {contentFile.substring(0, 20)}
                      {contentFile.length > 20 ? "..." : ""}
                    </span>
                  )}
                </p>
                <div className="flex gap-2 justify-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setContentUploaded(false);
                      setContentFile("");
                      setTotalPages(0);
                      setColorPages([]);
                    }}
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Entfernen
                  </Button>
                  <Button size="sm" onClick={handleContentUpload}>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Neue Version
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leseprobe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="reading-sample"
                  checked={enableSampleReading}
                  onCheckedChange={setEnableSampleReading}
                />
                <Label htmlFor="reading-sample">Leseprobe aktivieren</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Ermöglicht potenziellen Lesern, einen Teil des Buches vorab zu
                lesen
              </p>
            </div>
            {enableSampleReading && (
              <Button variant="outline" size="sm">
                <BookOpenIcon className="h-4 w-4 mr-2" />
                Leseprobe anpassen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ContentTab;
