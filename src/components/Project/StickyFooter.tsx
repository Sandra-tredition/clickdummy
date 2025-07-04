import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, AlertCircleIcon, TrashIcon } from "lucide-react";
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

interface StickyFooterProps {
  isProjectReadyForPublishing: () => boolean;
  setIsPublishingModalOpen: (isOpen: boolean) => void;
  projectId: string;
}

const StickyFooter: React.FC<StickyFooterProps> = ({
  isProjectReadyForPublishing,
  setIsPublishingModalOpen,
  projectId,
}) => {
  return (
    <>
      {/* Bottom spacing to prevent sticky bar overlap */}
      <div className="h-20"></div>
      {/* Sticky Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Left side - Project Delete Button */}
            <div className="flex-shrink-0">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    size="sm"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Projekt löschen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Projekt löschen</AlertDialogTitle>
                    <AlertDialogDescription>
                      Möchten Sie dieses Projekt wirklich löschen? Diese Aktion
                      kann nicht rückgängig gemacht werden. Alle zugehörigen
                      Ausgaben und Autorenzuweisungen werden ebenfalls gelöscht.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        try {
                          // Use the deleteProject function from the API library
                          const { deleteProject } = await import(
                            "@/lib/api/projects"
                          );
                          const { error } = await deleteProject(projectId);

                          if (error) {
                            console.error("Error deleting project:", error);
                            toast({
                              title: "Fehler",
                              description:
                                "Das Projekt konnte nicht gelöscht werden.",
                              variant: "destructive",
                            });
                            return;
                          }

                          toast({
                            title: "Erfolg",
                            description:
                              "Das Projekt wurde erfolgreich gelöscht.",
                          });

                          // Redirect to projects list
                          window.location.href = "/";
                        } catch (error) {
                          console.error("Error deleting project:", error);
                          toast({
                            title: "Fehler",
                            description:
                              "Das Projekt konnte nicht gelöscht werden.",
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

            {/* Right side - Status and Publish Button */}
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <div className="flex-shrink-0">
                {isProjectReadyForPublishing() ? (
                  <Badge className="bg-green-600 text-white flex items-center rounded-full whitespace-nowrap">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Bereit zur Veröffentlichung
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 border border-amber-200 flex items-center whitespace-nowrap"
                  >
                    <AlertCircleIcon className="h-4 w-4 mr-1" />
                    In Bearbeitung
                  </Badge>
                )}
              </div>

              {/* Publish Button */}
              <Button
                data-tour-target="publish-button"
                disabled={!isProjectReadyForPublishing()}
                className={
                  !isProjectReadyForPublishing()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
                onClick={() => {
                  setIsPublishingModalOpen(true);
                }}
                size="sm"
              >
                Veröffentlichen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StickyFooter;
