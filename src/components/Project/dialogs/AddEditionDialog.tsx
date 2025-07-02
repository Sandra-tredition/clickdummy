import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

interface AddEditionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editions: any[];
  projectId: string;
  setEditions: (editions: any[]) => void;
}

const AddEditionDialog: React.FC<AddEditionDialogProps> = ({
  isOpen,
  onOpenChange,
  editions,
  projectId,
  setEditions,
}) => {
  const [newEdition, setNewEdition] = useState({
    title: "Standardausgabe",
    produktform: "",
    ausgabenart: null,
    isSpecialEdition: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if a combination of ausgabenart and produktform already exists
  const isProductFormUsed = (
    produktform: string,
    ausgabenart: string | null,
  ) => {
    return editions.some(
      (edition) =>
        edition.produktform === produktform &&
        edition.ausgabenart === ausgabenart,
    );
  };

  const handleCreateEdition = async () => {
    if (!newEdition.produktform) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie eine Produktform aus.",
        variant: "destructive",
      });
      return;
    }

    if (newEdition.isSpecialEdition && !newEdition.ausgabenart) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie eine Ausgabenart aus.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Create new edition in the database
    const newEditionItem = {
      project_id: projectId,
      title: newEdition.title,
      produktform: newEdition.produktform,
      ausgabenart: newEdition.isSpecialEdition ? newEdition.ausgabenart : null,
      price: 0,
      pages: 0,
      status: "Draft",
      isbn: "",
      is_complete: false,
      format_complete: false,
      content_complete: false,
      cover_complete: false,
      pricing_complete: false,
      authors_complete: false,
    };

    try {
      // Import the createEdition function dynamically to avoid circular dependencies
      const { createEdition } = await import("@/lib/api/editions");
      const { data, error } = await createEdition(newEditionItem);

      if (error) {
        console.error("Error creating edition:", error);
        toast({
          title: "Fehler",
          description:
            "Die Ausgabe konnte nicht erstellt werden: " + error.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (data && data.length > 0) {
        // Transform the database response to match frontend naming convention
        const newEditionData = {
          id: data[0].id,
          title: data[0].title,
          produktform: data[0].produktform,
          ausgabenart: data[0].ausgabenart,
          price: data[0].price,
          pages: data[0].pages,
          status: data[0].status,
          isbn: data[0].isbn,
          isComplete: data[0].is_complete,
          formatComplete: data[0].format_complete,
          contentComplete: data[0].content_complete,
          coverComplete: data[0].cover_complete,
          pricingComplete: data[0].pricing_complete,
          authorsComplete: data[0].authors_complete,
          contentFile: data[0].content_file,
          contentUploadDate: data[0].content_upload_date,
          coverFile: data[0].cover_file,
          coverUploadDate: data[0].cover_upload_date,
        };

        setEditions([...editions, newEditionData]);
        toast({
          title: "Erfolg",
          description: "Die Ausgabe wurde erfolgreich erstellt.",
        });

        // Reset form
        setNewEdition({
          title: "Standardausgabe",
          produktform: "",
          ausgabenart: null,
          isSpecialEdition: false,
        });

        onOpenChange(false);
      } else {
        toast({
          title: "Fehler",
          description:
            "Die Ausgabe konnte nicht erstellt werden: Keine Daten zurückgegeben.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error creating edition:", error);
      toast({
        title: "Fehler",
        description:
          "Die Ausgabe konnte nicht erstellt werden: " +
          (error.message || "Unbekannter Fehler"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isSubmitting) {
          onOpenChange(open);
          if (!open) {
            // Reset form when dialog is closed
            setNewEdition({
              title: "Standardausgabe",
              produktform: "",
              ausgabenart: null,
              isSpecialEdition: false,
            });
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            Neue Ausgabe hinzufügen
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Tabs
            defaultValue="standard"
            onValueChange={(value) => {
              setNewEdition({
                ...newEdition,
                title:
                  value === "standard"
                    ? "Standardausgabe"
                    : "Besondere Ausgabe",
                isSpecialEdition: value === "special",
                ausgabenart:
                  value === "standard" ? null : newEdition.ausgabenart,
              });
            }}
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="standard">Standardausgabe</TabsTrigger>
              <TabsTrigger value="special">Besondere Ausgabe</TabsTrigger>
            </TabsList>

            <TabsContent value="standard" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="produktform">Produktform</Label>
                <Select
                  onValueChange={(value) =>
                    setNewEdition({ ...newEdition, produktform: value })
                  }
                  value={newEdition.produktform}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Produktform auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="Softcover"
                      disabled={isProductFormUsed("Softcover", null)}
                    >
                      Softcover
                      {isProductFormUsed("Softcover", null) && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (bereits vorhanden)
                        </span>
                      )}
                    </SelectItem>
                    <SelectItem
                      value="Hardcover"
                      disabled={isProductFormUsed("Hardcover", null)}
                    >
                      Hardcover
                      {isProductFormUsed("Hardcover", null) && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (bereits vorhanden)
                        </span>
                      )}
                    </SelectItem>
                    <SelectItem
                      value="E-Book"
                      disabled={isProductFormUsed("E-Book", null)}
                    >
                      E-Book
                      {isProductFormUsed("E-Book", null) && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (bereits vorhanden)
                        </span>
                      )}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="special" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="ausgabenart">Ausgabenart</Label>
                <Select
                  onValueChange={(value) =>
                    setNewEdition({ ...newEdition, ausgabenart: value })
                  }
                  value={newEdition.ausgabenart || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ausgabenart auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Großdruck (Schriftgröße 14-19 pt)">
                      Großdruck (Schriftgröße 14-19 pt)
                    </SelectItem>
                    <SelectItem value="Zweisprachige Ausgabe">
                      Zweisprachige Ausgabe
                    </SelectItem>
                    <SelectItem value="Mehrsprachige Ausgabe">
                      Mehrsprachige Ausgabe
                    </SelectItem>
                    <SelectItem value="Sonderausgabe">Sonderausgabe</SelectItem>
                    <SelectItem value="Gekürzte Ausgabe">
                      Gekürzte Ausgabe
                    </SelectItem>
                    <SelectItem value="Erweiterte Ausgabe">
                      Erweiterte Ausgabe
                    </SelectItem>
                    <SelectItem value="Leicht zu lesende Ausgabe">
                      Leicht zu lesende Ausgabe
                    </SelectItem>
                    <SelectItem value="Schülerausgabe">
                      Schülerausgabe
                    </SelectItem>
                    <SelectItem value="Lehrerausgabe">Lehrerausgabe</SelectItem>
                    <SelectItem value="Limitierte Ausgabe">
                      Limitierte Ausgabe
                    </SelectItem>
                    <SelectItem value="Illustrierte Ausgabe">
                      Illustrierte Ausgabe
                    </SelectItem>
                    <SelectItem value="Kommentierte Ausgabe">
                      Kommentierte Ausgabe
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="produktform">Produktform</Label>
                <Select
                  onValueChange={(value) =>
                    setNewEdition({ ...newEdition, produktform: value })
                  }
                  value={newEdition.produktform}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Produktform auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Softcover">Softcover</SelectItem>
                    <SelectItem value="Hardcover">Hardcover</SelectItem>
                    <SelectItem value="E-Book">E-Book</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            <XIcon className="h-4 w-4 mr-2" />
            Abbrechen
          </Button>
          <Button
            onClick={handleCreateEdition}
            disabled={!newEdition.produktform || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Wird erstellt...
              </span>
            ) : (
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                Ausgabe erstellen
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditionDialog;
