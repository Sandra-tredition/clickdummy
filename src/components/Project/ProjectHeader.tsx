import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  EditIcon,
  TrashIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  UsersIcon,
  UserIcon,
  EyeIcon,
  XIcon,
  SaveIcon,
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

interface ProjectHeaderProps {
  project: any;
  projectAuthors: any[];
  seriesList: any[];
  isEditing: boolean;
  isProjectDetailsComplete: () => boolean;
  isProjectReadyForPublishing: () => boolean;
  setIsPublishingModalOpen: (isOpen: boolean) => void;
  handleEditToggle?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onProjectUpdate?: (updatedProject: any) => void;
  genreOptions?: any[];
  id?: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  projectAuthors,
  seriesList,
  isEditing,
  isProjectDetailsComplete,
  isProjectReadyForPublishing,
  setIsPublishingModalOpen,
  handleEditToggle,
  onSave,
  onCancel,
  onProjectUpdate,
  genreOptions = [],
  id,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    title: project?.title || "",
    subtitle: project?.subtitle || "",
    languages: project?.languages || [],
  });

  const handleEditModalOpen = () => {
    setEditedData({
      title: project?.title || "",
      subtitle: project?.subtitle || "",
      languages: project?.languages || [],
    });
    setIsEditModalOpen(true);
  };

  const handleSaveBasicInfo = () => {
    if (onProjectUpdate) {
      onProjectUpdate({
        ...project,
        ...editedData,
      });
    }
    setIsEditModalOpen(false);
    toast({
      title: "Erfolg",
      description: "Projektinformationen wurden aktualisiert.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePublish = () => {
    console.log("Publishing project:", project);
    setIsPublishingModalOpen(true);
  };

  return (
    <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-8">
        <div className="flex flex-col gap-6">
          {/* Project Status and Publish Action - first */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              {isProjectReadyForPublishing() ? (
                <Badge className="bg-green-600 text-white flex items-center rounded-full">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Bereit zur Veröffentlichung
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 border border-amber-200 flex items-center"
                >
                  <AlertCircleIcon className="h-4 w-4 mr-1" />
                  In Bearbeitung
                </Badge>
              )}

              {/* Status explanation text */}
              <span className="text-sm text-gray-600">
                {isProjectReadyForPublishing()
                  ? "Alle erforderlichen Daten sind vollständig"
                  : "Projekt benötigt noch weitere Angaben"}
              </span>
            </div>

            {/* Publish Button - always shown, disabled when not ready */}
            <Button
              data-tour-target="publish-button"
              onClick={handlePublish}
              size="sm"
              disabled={!isProjectReadyForPublishing()}
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Veröffentlichen
            </Button>
          </div>

          {/* Header Content with Edit Button */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 pt-4 border-t border-gray-100">
            <div className="flex-1">
              <div className="mb-3">
                <div className="flex items-start gap-3 flex-wrap">
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    {project.title}
                  </h1>
                  {Array.isArray(project.languages) &&
                    project.languages.length > 0 && (
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0 mt-1">
                        {project.languages.join(", ")}
                      </span>
                    )}
                </div>
              </div>
              {project.subtitle && (
                <h2 className="text-xl text-gray-600 mb-0">
                  {project.subtitle}
                </h2>
              )}
            </div>

            {/* Header Edit Button - positioned near the title */}
            <div className="flex-shrink-0">
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditModalOpen}
                  >
                    <EditIcon className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Grunddaten bearbeiten</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Title and Subtitle */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Titel</Label>
                        <Input
                          id="title"
                          name="title"
                          value={editedData.title}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subtitle">Untertitel (optional)</Label>
                        <Input
                          id="subtitle"
                          name="subtitle"
                          value={editedData.subtitle}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="space-y-2">
                      <Label htmlFor="languages">Sprache(n)</Label>
                      <MultiSelect
                        options={[
                          { value: "Deutsch", label: "Deutsch" },
                          { value: "English", label: "Englisch" },
                          { value: "Français", label: "Französisch" },
                          { value: "Español", label: "Spanisch" },
                          { value: "Italiano", label: "Italienisch" },
                          { value: "Nederlands", label: "Niederländisch" },
                          { value: "Polski", label: "Polnisch" },
                          { value: "Português", label: "Portugiesisch" },
                          { value: "Русский", label: "Russisch" },
                          { value: "中文", label: "Chinesisch" },
                          { value: "日本語", label: "Japanisch" },
                        ]}
                        selected={
                          Array.isArray(editedData.languages)
                            ? editedData.languages
                            : []
                        }
                        onChange={(values) =>
                          handleSelectChange("languages", values)
                        }
                        placeholder="Sprachen auswählen"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      <XIcon className="h-4 w-4 mr-2" />
                      Abbrechen
                    </Button>
                    <Button onClick={handleSaveBasicInfo}>
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Speichern
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
