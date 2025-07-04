import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { TreeSelect } from "@/components/ui/treeselect";
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
    genres: project?.genres || [],
  });

  const handleEditModalOpen = () => {
    setEditedData({
      title: project?.title || "",
      subtitle: project?.subtitle || "",
      languages: project?.languages || [],
      genres: project?.genres || [],
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
  return (
    <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
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
              <h2 className="text-xl text-gray-600 mb-6">{project.subtitle}</h2>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-6">
              {Array.isArray(project.genres) && project.genres.length > 0 && (
                <div className="flex items-center gap-2">
                  {project.genres
                    .slice(0, 3)
                    .map((genre: string, index: number) => {
                      const genreLabel = genre.split(".").pop() || genre;
                      return (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="capitalize bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 max-w-xs truncate"
                          title={genreLabel}
                        >
                          {genreLabel}
                        </Badge>
                      );
                    })}
                  {project.genres.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                    >
                      +{project.genres.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Edit Button */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  {/* Genres */}
                  <div className="space-y-2">
                    <Label htmlFor="genres">Genre(s)</Label>
                    <TreeSelect
                      options={genreOptions}
                      selected={
                        Array.isArray(editedData.genres)
                          ? editedData.genres
                          : []
                      }
                      onChange={(values) =>
                        handleSelectChange("genres", values)
                      }
                      placeholder="Genres auswählen"
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
  );
};

export default ProjectHeader;
