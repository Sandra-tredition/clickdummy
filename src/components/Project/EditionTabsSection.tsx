import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpenIcon,
  BookIcon,
  TabletIcon,
  FileTextIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  PlusCircleIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";

interface Edition {
  id: string;
  title: string;
  produktform: string;
  ausgabenart?: string;
  price: number;
  pages?: number;
  status: string;
  is_complete: boolean;
  format_complete: boolean;
  content_complete: boolean;
  cover_complete: boolean;
  pricing_complete: boolean;
  authors_complete: boolean;
  isbn?: string;
}

interface EditionTabsSectionProps {
  editions: Edition[];
  setEditions: (editions: Edition[]) => void;
  activeEditionTab: string;
  setActiveEditionTab: (tab: string) => void;
  setIsAddEditionDialogOpen: (isOpen: boolean) => void;
  isPublishedView?: boolean;
}

const EditionTabsSection: React.FC<EditionTabsSectionProps> = ({
  editions,
  setEditions,
  activeEditionTab,
  setActiveEditionTab,
  setIsAddEditionDialogOpen,
  isPublishedView = false,
}) => {
  // Function to get icon for product form
  const getProductFormIcon = (produktform: string) => {
    switch (produktform?.toLowerCase()) {
      case "softcover":
        return <BookOpenIcon className="h-6 w-6" />;
      case "hardcover":
        return <BookIcon className="h-6 w-6" />;
      case "e-book":
        return <TabletIcon className="h-6 w-6" />;
      default:
        return <FileTextIcon className="h-6 w-6" />;
    }
  };

  // Function to get status color and icon
  const getStatusInfo = (edition: Edition) => {
    const isComplete = edition.is_complete;
    const status = edition.status;

    if (status === "Veröffentlicht") {
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircleIcon className="h-3 w-3" />,
        text: "Veröffentlicht",
      };
    } else if (isComplete) {
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <CheckCircleIcon className="h-3 w-3" />,
        text: "Bereit",
      };
    } else {
      return {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: <AlertCircleIcon className="h-3 w-3" />,
        text: "In Bearbeitung",
      };
    }
  };

  if (editions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              Ausgaben
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 h-auto bg-gray-50 rounded-lg p-1">
            <button
              onClick={() =>
                !isPublishedView && setIsAddEditionDialogOpen(true)
              }
              className={`flex flex-col items-center p-4 h-auto min-h-[120px] border border-dashed rounded-lg transition-colors cursor-pointer ${
                isPublishedView
                  ? "border-gray-300 bg-white opacity-50"
                  : "border-green-300 bg-white hover:bg-green-50"
              }`}
              disabled={isPublishedView}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <div
                  className={isPublishedView ? "text-gray-400" : "text-black"}
                >
                  <PlusCircleIcon className="h-6 w-6" />
                </div>
                <div
                  className={`text-center text-sm font-normal ${
                    isPublishedView ? "text-gray-400" : "text-black"
                  }`}
                >
                  Erste Ausgabe anlegen
                </div>
              </div>
            </button>
            <div className="flex flex-col items-center p-4 h-auto min-h-[120px] border border-gray-200 rounded-lg bg-gray-50 opacity-30">
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <div className="text-gray-400">
                  <PlusCircleIcon className="h-6 w-6" />
                </div>
                <div className="text-center text-xs text-gray-400">
                  Weitere Ausgabe
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <CardTitle className="text-xxl font-bold text-gray-900 flex items-center">
            Ausgaben
          </CardTitle>
        </div>
        <Tabs
          value={activeEditionTab}
          onValueChange={setActiveEditionTab}
          className="w-full"
        >
          <TabsList
            className="grid gap-2 h-auto bg-gray-50 rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${Math.min(editions.length + (isPublishedView ? 0 : 1), 5)}, 1fr)`,
            }}
          >
            {editions.map((edition) => {
              const statusInfo = getStatusInfo(edition);
              const isActive = activeEditionTab === edition.id;

              return (
                <TabsTrigger
                  key={edition.id}
                  value={edition.id}
                  className={`flex flex-col items-center p-4 h-auto min-h-[120px] data-[state=active]:bg-white data-[state=active]:shadow-sm border border-gray-300 data-[state=active]:border-green-500 data-[state=active]:border-1 data-[state=inactive]:bg-gray-100 data-[state=inactive]:hover:bg-gray-200 rounded-lg transition-colors`}
                >
                  <div className="flex flex-col items-center justify-between h-full space-y-2">
                    <div className="text-gray-600">
                      {getProductFormIcon(edition.produktform)}
                    </div>
                    <div className="text-center flex-1 flex flex-col justify-center">
                      <div className="font-medium text-sm">
                        {edition.produktform}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 min-h-[16px]">
                        {edition.ausgabenart || ""}
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                    >
                      {statusInfo.icon}
                      {statusInfo.text}
                    </div>
                  </div>
                </TabsTrigger>
              );
            })}
            {/* Add Edition Tab Tile - only in editing view */}
            {!isPublishedView && (
              <TabsTrigger
                value="add-edition"
                className="flex flex-col items-center p-4 h-auto min-h-[120px] border border-dashed border-green-300 bg-white hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                onClick={() => setIsAddEditionDialogOpen(true)}
              >
                <div className="flex flex-col items-center justify-center h-full space-y-2">
                  <div className="text-black">
                    <PlusCircleIcon className="h-6 w-6" />
                  </div>
                  <div className="text-center text-sm text-black font-normal">
                    Weitere Ausgabe
                  </div>
                  <div className="text-center text-sm text-black font-normal">
                    hinzufügen
                  </div>
                </div>
              </TabsTrigger>
            )}
          </TabsList>

          {editions.map((edition) => (
            <TabsContent key={edition.id} value={edition.id} className="mt-2">
              <div className="bg-white border border-gray-200 border-t-green-500 border-t-1 rounded-lg rounded-t-none shadow-sm overflow-hidden">
                <div
                  className={`p-4 border-b flex justify-between items-center ${
                    isPublishedView ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-medium">
                          {edition.produktform}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{edition.ausgabenart || "Standardausgabe"}</span>
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
                  {!isPublishedView && (
                    <div className="flex items-center gap-2">
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

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            window.location.href = `/edition/${edition.id}`;
                          }}
                        >
                          <EditIcon className="h-4 w-4 mr-1" />
                          Bearbeiten
                        </Button>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Ausgabe löschen</AlertDialogTitle>
                            <AlertDialogDescription>
                              Möchten Sie die Ausgabe "{edition.produktform}"
                              wirklich löschen? Diese Aktion kann nicht
                              rückgängig gemacht werden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                try {
                                  // Remove edition from local state
                                  setEditions(
                                    editions.filter((e) => e.id !== edition.id),
                                  );

                                  toast({
                                    title: "Erfolg",
                                    description:
                                      "Die Ausgabe wurde erfolgreich gelöscht.",
                                  });
                                } catch (error) {
                                  console.error(
                                    "Error deleting edition:",
                                    error,
                                  );
                                  toast({
                                    title: "Fehler",
                                    description:
                                      "Die Ausgabe konnte nicht gelöscht werden.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
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
                        {isPublishedView ? (
                          // Non-clickable badges for published view
                          <>
                            <div
                              className={`px-3 py-1 rounded-md ${
                                edition.format_complete
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              <span className="text-xs font-medium flex items-center">
                                {edition.format_complete ? (
                                  <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                                ) : (
                                  <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                                )}
                                Format
                              </span>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-md ${
                                edition.content_complete
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              <span className="text-xs font-medium flex items-center">
                                {edition.content_complete ? (
                                  <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                                ) : (
                                  <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                                )}
                                Inhalt
                              </span>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-md ${
                                edition.cover_complete
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              <span className="text-xs font-medium flex items-center">
                                {edition.cover_complete ? (
                                  <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                                ) : (
                                  <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                                )}
                                Cover
                              </span>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-md ${
                                edition.pricing_complete
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              <span className="text-xs font-medium flex items-center">
                                {edition.pricing_complete ? (
                                  <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                                ) : (
                                  <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                                )}
                                Preis
                              </span>
                            </div>
                          </>
                        ) : (
                          // Clickable links for editing view
                          <>
                            <a
                              href={`/edition/${edition.id}?tab=format`}
                              className={`px-3 py-1 rounded-md ${
                                edition.format_complete
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              } cursor-pointer hover:opacity-90`}
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
                              className={`px-3 py-1 rounded-md ${
                                edition.content_complete
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              } cursor-pointer hover:opacity-90`}
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
                              className={`px-3 py-1 rounded-md ${
                                edition.cover_complete
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              } cursor-pointer hover:opacity-90`}
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
                              className={`px-3 py-1 rounded-md ${
                                edition.pricing_complete
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              } cursor-pointer hover:opacity-90`}
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
                          </>
                        )}
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
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EditionTabsSection;
