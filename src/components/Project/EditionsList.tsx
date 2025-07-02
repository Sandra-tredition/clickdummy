import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  PlusCircleIcon,
  TrashIcon,
  EditIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
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

interface EditionsListProps {
  editions: any[];
  setEditions: (editions: any[]) => void;
  setIsAddEditionDialogOpen: (isOpen: boolean) => void;
}

const EditionsList: React.FC<EditionsListProps> = ({
  editions,
  setEditions,
  setIsAddEditionDialogOpen,
}) => {
  console.log("EditionsList component received editions:", editions);
  console.log("Number of editions:", editions?.length || 0);
  const handleDeleteEdition = async (editionId: string) => {
    try {
      // Import the deleteEdition function from the API library
      const { deleteEdition } = await import("@/lib/api/editions");
      const { error } = await deleteEdition(editionId);

      if (error) {
        console.error("Error deleting edition:", error);
        toast({
          title: "Fehler",
          description: "Die Ausgabe konnte nicht gelöscht werden.",
          variant: "destructive",
        });
        return;
      }

      // Simply filter out the deleted edition from the local state
      setEditions(editions.filter((e) => e.id !== editionId));
      toast({
        title: "Erfolg",
        description: "Die Ausgabe wurde erfolgreich gelöscht.",
      });
    } catch (error) {
      console.error("Error deleting edition:", error);
      toast({
        title: "Fehler",
        description: "Die Ausgabe konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Ausgaben verwalten</h2>
          <Button
            variant="outline"
            onClick={() => setIsAddEditionDialogOpen(true)}
          >
            <PlusCircleIcon className="h-4 w-4 mr-2" />
            Ausgabe hinzufügen
          </Button>
        </div>

        <div className="flex flex-col space-y-6">
          {console.log("Rendering editions list, length:", editions.length)}
          {editions.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-muted-foreground mb-4"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
              <h3 className="text-lg font-medium mb-2">
                Keine Ausgaben vorhanden
              </h3>
              <p className="text-muted-foreground mb-4 text-center">
                Lege mindestestens eine Ausgabe für dieses Buchprojekt an.
              </p>
            </div>
          ) : (
            [...editions]
              .sort((a, b) => {
                // Sort by ausgabenart (special editions first)
                if (a.ausgabenart && !b.ausgabenart) return -1;
                if (!a.ausgabenart && b.ausgabenart) return 1;
                if (a.ausgabenart && b.ausgabenart) {
                  return a.ausgabenart.localeCompare(b.ausgabenart);
                }
                // Then by produktform
                return a.produktform.localeCompare(b.produktform);
              })
              .map((edition) => (
                <div
                  key={edition.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow w-full"
                >
                  <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-3 flex-1">
                      {edition.cover_image && (
                        <div className="flex-shrink-0">
                          <img
                            src={edition.cover_image}
                            alt={`Cover für ${edition.produktform}`}
                            className="w-12 h-16 object-cover rounded border border-gray-200 shadow-sm"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-medium">
                            {edition.produktform}
                          </h3>
                          <Badge
                            variant={
                              edition.status === "Ready" ||
                              edition.status === "Im Verkauf"
                                ? "default"
                                : "outline"
                            }
                            className={
                              edition.status === "Ready" ||
                              edition.status === "Im Verkauf"
                                ? "bg-green-600 hover:bg-green-700"
                                : "border-amber-500 text-amber-500"
                            }
                          >
                            {edition.status === "Ready" ||
                            edition.status === "Im Verkauf"
                              ? edition.status === "Im Verkauf"
                                ? "Im Verkauf"
                                : "Veröffentlicht"
                              : "Ready"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>
                            {edition.ausgabenart || "Standardausgabe"}
                          </span>
                          {edition.isbn && (
                            <span className="flex items-center gap-2">
                              <span className="text-gray-400">•</span>
                              <span>ISBN: {edition.isbn}</span>
                            </span>
                          )}
                          {!edition.isbn && (
                            <span className="flex items-center gap-1">
                              <span className="text-gray-400">•</span>
                              <span className="italic">Keine ISBN</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log("Opening edition with ID:", edition.id);
                          window.location.href = `/edition/${edition.id}`;
                        }}
                      >
                        <EditIcon className="h-4 w-4 mr-2" />
                        Bearbeiten
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Ausgabe löschen</AlertDialogTitle>
                            <AlertDialogDescription>
                              Möchten Sie diese Ausgabe wirklich löschen? Diese
                              Aktion kann nicht rückgängig gemacht werden.
                              {edition.status === "Ready" && (
                                <p className="mt-2 text-red-500 font-semibold">
                                  Achtung: Diese Ausgabe ist veröffentlicht.
                                  Durch das Löschen wird das Buch aus dem
                                  Verkauf genommen, es wird jedoch weiterhin in
                                  Buchkatalogen gelistet bleiben. Es kann aber
                                  nicht mehr bestellt werden.
                                </p>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteEdition(edition.id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        {edition.pages && edition.pages > 0 && (
                          <div className="text-sm text-gray-500">
                            {edition.pages} Seiten
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap mt-4 items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          <a
                            href={`/edition/${edition.id}?tab=format`}
                            className={`px-3 py-1 rounded-md ${edition.format_complete ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"} cursor-pointer hover:opacity-90`}
                          >
                            <span className="text-xs font-medium flex items-center">
                              {edition.format_complete ? (
                                <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                              ) : (
                                <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                              )}
                              Format
                            </span>
                          </a>
                          <a
                            href={`/edition/${edition.id}?tab=content`}
                            className={`px-3 py-1 rounded-md ${edition.content_complete ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"} cursor-pointer hover:opacity-90`}
                          >
                            <span className="text-xs font-medium flex items-center">
                              {edition.content_complete ? (
                                <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                              ) : (
                                <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                              )}
                              Inhalt
                            </span>
                          </a>
                          <a
                            href={`/edition/${edition.id}?tab=cover`}
                            className={`px-3 py-1 rounded-md ${edition.cover_complete ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"} cursor-pointer hover:opacity-90`}
                          >
                            <span className="text-xs font-medium flex items-center">
                              {edition.cover_complete ? (
                                <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                              ) : (
                                <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                              )}
                              Cover
                            </span>
                          </a>
                          <a
                            href={`/edition/${edition.id}?tab=pricing`}
                            className={`px-3 py-1 rounded-md ${edition.pricing_complete ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"} cursor-pointer hover:opacity-90`}
                          >
                            <span className="text-xs font-medium flex items-center">
                              {edition.pricing_complete ? (
                                <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                              ) : (
                                <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                              )}
                              Preis
                            </span>
                          </a>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Preis</div>
                          <div className="font-bold text-lg">
                            {edition.price
                              ? `${edition.price.toFixed(2)} €`
                              : "--,-- €"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
      <div className="border-b pb-4 mt-8"></div>
    </div>
  );
};

export default EditionsList;
