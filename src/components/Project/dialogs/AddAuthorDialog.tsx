import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockAuthors, getBiographiesForAuthor } from "@/lib/mockData/authors";

interface AddAuthorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  authors?: any[];
  selectedAuthor?: string;
  selectedAuthorRole?: string;
  selectedBiography?: string;
  authorBiographies?: any[];
  handleAuthorChange?: (authorId: string) => void;
  setSelectedAuthorRole?: (role: string) => void;
  setSelectedBiography?: (biographyId: string) => void;
  handleAddAuthorToProject?: () => void;
  projectLanguages?: string[];
  // New props for enhanced functionality
  title?: string;
  description?: string;
  buttonText?: string;
  onConfirm?: () => void;
  // Internal state management for standalone usage
  standalone?: boolean;
  // Existing project authors to check for duplicates
  existingProjectAuthors?: any[];
}

const AddAuthorDialog: React.FC<AddAuthorDialogProps> = ({
  isOpen,
  onOpenChange,
  authors = mockAuthors,
  selectedAuthor: externalSelectedAuthor,
  selectedAuthorRole: externalSelectedAuthorRole,
  selectedBiography: externalSelectedBiography,
  authorBiographies = [],
  handleAuthorChange: externalHandleAuthorChange,
  setSelectedAuthorRole: externalSetSelectedAuthorRole,
  setSelectedBiography: externalSetSelectedBiography,
  handleAddAuthorToProject: externalHandleAddAuthorToProject,
  projectLanguages = [],
  // Enhanced props
  title = "Urheber hinzufügen",
  description,
  buttonText = "Hinzufügen",
  onConfirm,
  standalone = false,
  existingProjectAuthors = [],
}) => {
  // Internal state for standalone usage
  const [internalSelectedAuthor, setInternalSelectedAuthor] =
    React.useState("");
  const [internalSelectedAuthorRole, setInternalSelectedAuthorRole] =
    React.useState("Autor");
  const [internalSelectedBiography, setInternalSelectedBiography] =
    React.useState("");

  // Use external or internal state based on standalone mode
  const selectedAuthor = standalone
    ? internalSelectedAuthor
    : externalSelectedAuthor || "";
  const selectedAuthorRole = standalone
    ? internalSelectedAuthorRole
    : externalSelectedAuthorRole || "Autor";
  const selectedBiography = standalone
    ? internalSelectedBiography
    : externalSelectedBiography || "";

  const handleAuthorChange = standalone
    ? (authorId: string) => {
        setInternalSelectedAuthor(authorId);
        setInternalSelectedBiography(""); // Reset biography when author changes
      }
    : externalHandleAuthorChange || (() => {});
  const setSelectedAuthorRole = standalone
    ? setInternalSelectedAuthorRole
    : externalSetSelectedAuthorRole || (() => {});
  const setSelectedBiography = standalone
    ? setInternalSelectedBiography
    : externalSetSelectedBiography || (() => {});

  // Get project language for biography filtering
  const projectLanguage = projectLanguages?.[0] || "de"; // Default to German

  // Get available biographies for selected author, filtered by project language
  const availableBiographies = React.useMemo(() => {
    if (!selectedAuthor) return [];
    const biographies = getBiographiesForAuthor(selectedAuthor);
    // Filter biographies by project language (handle both language codes and full names)
    return biographies.filter((bio) => {
      const bioLang = bio.language?.toLowerCase();
      const projLang = projectLanguage?.toLowerCase();

      // Direct match
      if (bioLang === projLang) return true;

      // Language code to full name mapping
      const languageMapping: { [key: string]: string } = {
        de: "deutsch",
        en: "english",
        fr: "français",
        es: "español",
        it: "italiano",
        nl: "nederlands",
        pl: "polski",
        pt: "português",
        ru: "русский",
        zh: "中文",
        ja: "日本語",
      };

      // Check if project language code matches biography language name
      if (languageMapping[projLang] === bioLang) return true;

      // Check if biography language code matches project language name
      if (languageMapping[bioLang] === projLang) return true;

      return false;
    });
  }, [selectedAuthor, projectLanguage]);

  // Filter biographies by project languages (for backward compatibility)
  const filteredBiographies = authorBiographies.filter(
    (bio) =>
      projectLanguages.length === 0 || projectLanguages.includes(bio.language),
  );

  // Use availableBiographies for standalone mode, filteredBiographies for legacy mode
  const biographiesToShow = standalone
    ? availableBiographies
    : filteredBiographies;

  // Get existing author-role combinations for the selected author
  const existingAuthorRoles = React.useMemo(() => {
    if (!selectedAuthor || !existingProjectAuthors) return [];
    return existingProjectAuthors
      .filter(
        (projectAuthor) =>
          projectAuthor.author_id === selectedAuthor ||
          projectAuthor.authors?.id === selectedAuthor,
      )
      .map((projectAuthor) => projectAuthor.author_role)
      .filter(Boolean);
  }, [selectedAuthor, existingProjectAuthors]);

  // Define available roles
  const availableRoles = [
    { value: "Autor", label: "Autor" },
    { value: "Co-Autor", label: "Co-Autor" },
    { value: "Herausgeber", label: "Herausgeber" },
    { value: "Übersetzer", label: "Übersetzer" },
    { value: "Illustrator", label: "Illustrator" },
    { value: "Lektor", label: "Lektor" },
  ];

  // Check if a role is already assigned to the selected author
  const isRoleDisabled = (roleValue: string) => {
    return existingAuthorRoles.includes(roleValue);
  };

  // Reset biography selection when author changes (for external state management)
  React.useEffect(() => {
    if (!standalone && externalSetSelectedBiography) {
      externalSetSelectedBiography("");
    }
  }, [selectedAuthor, standalone, externalSetSelectedBiography]);

  const handleConfirm = () => {
    try {
      if (standalone && onConfirm) {
        onConfirm();
        // Reset internal state after successful action
        setInternalSelectedAuthor("");
        setInternalSelectedBiography("");
        setInternalSelectedAuthorRole("Autor");
      } else if (externalHandleAddAuthorToProject) {
        externalHandleAddAuthorToProject();
      }
      // Always close dialog after successful action
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding author:", error);
      // Don't close dialog if there's an error
    }
  };

  const handleCancel = () => {
    if (standalone) {
      setInternalSelectedAuthor("");
      setInternalSelectedBiography("");
      setInternalSelectedAuthorRole("Autor");
    }
    onOpenChange(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author">Urheber</Label>
            <Select
              value={selectedAuthor || ""}
              onValueChange={handleAuthorChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Urheber auswählen" />
              </SelectTrigger>
              <SelectContent
                className="max-h-[200px] overflow-y-auto"
                position="popper"
                sideOffset={5}
              >
                {authors.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    <div className="flex items-center gap-2 w-full truncate">
                      <span className="font-medium truncate">
                        {author.author_type === "person"
                          ? `${author.first_name} ${author.last_name}`
                          : author.company_name}
                      </span>
                      {author.profession && (
                        <span className="text-sm text-muted-foreground truncate">
                          ({author.profession})
                        </span>
                      )}
                      {author.is_pseudonym && (
                        <Badge
                          variant="secondary"
                          className="text-xs flex-shrink-0 ml-auto"
                        >
                          Pseudonym
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAuthor && (
            <div className="space-y-2">
              <Label htmlFor="biography-select">Biografie (optional)</Label>
              <Select
                value={selectedBiography}
                onValueChange={setSelectedBiography}
              >
                <SelectTrigger id="biography-select">
                  <SelectValue placeholder="Biografie auswählen" />
                </SelectTrigger>
                <SelectContent
                  className="max-h-[200px] overflow-y-auto"
                  position="popper"
                  sideOffset={5}
                >
                  {biographiesToShow.length > 0 ? (
                    biographiesToShow.map((biography) => (
                      <SelectItem key={biography.id} value={biography.id}>
                        <span className="font-medium truncate">
                          {biography.biography_label}
                        </span>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-biography" disabled>
                      Keine Biografie in Projektsprache (
                      {projectLanguage.toUpperCase()}) verfügbar
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Es sind nur Biografien auswählbar, die der Projektsprache{" "}
                {projectLanguage.toUpperCase()} entsprechen.
              </p>

              {/* Display selected biography */}
              {selectedBiography && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <h5 className="font-medium text-sm text-gray-900 mb-2">
                    Ausgewählte Biografie:
                  </h5>
                  <div className="text-left">
                    <p className="font-medium text-sm mb-1">
                      {
                        biographiesToShow.find(
                          (b) => b.id === selectedBiography,
                        )?.biography_label
                      }
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {
                        biographiesToShow.find(
                          (b) => b.id === selectedBiography,
                        )?.biography_text
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Rolle</Label>
            <Select
              value={selectedAuthorRole || "Autor"}
              onValueChange={setSelectedAuthorRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rolle auswählen" />
              </SelectTrigger>
              <SelectContent
                className="max-h-[200px] overflow-y-auto"
                position="popper"
                sideOffset={5}
              >
                {availableRoles.map((role) => {
                  const disabled = selectedAuthor && isRoleDisabled(role.value);
                  return (
                    <SelectItem
                      key={role.value}
                      value={role.value}
                      disabled={disabled}
                      className={
                        disabled ? "opacity-50 cursor-not-allowed" : ""
                      }
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{role.label}</span>
                        {disabled && (
                          <span className="text-xs text-muted-foreground ml-2">
                            (bereits vorhanden)
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedAuthor && existingAuthorRoles.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Bereits zugewiesene Rollen für diesen Urheber:{" "}
                {existingAuthorRoles.join(", ")}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            <XIcon className="h-4 w-4 mr-2" />
            Abbrechen
          </Button>
          <Button
            type="button"
            disabled={!selectedAuthor || !selectedAuthorRole}
            onClick={handleConfirm}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAuthorDialog;
