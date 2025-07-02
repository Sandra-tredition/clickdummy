import React from "react";
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

interface AddAuthorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  authors: any[];
  selectedAuthor: string;
  selectedAuthorRole: string;
  selectedBiography: string;
  authorBiographies: any[];
  handleAuthorChange: (authorId: string) => void;
  setSelectedAuthorRole: (role: string) => void;
  setSelectedBiography: (biographyId: string) => void;
  handleAddAuthorToProject: () => void;
  projectLanguages?: string[];
}

const AddAuthorDialog: React.FC<AddAuthorDialogProps> = ({
  isOpen,
  onOpenChange,
  authors,
  selectedAuthor,
  selectedAuthorRole,
  selectedBiography,
  authorBiographies,
  handleAuthorChange,
  setSelectedAuthorRole,
  setSelectedBiography,
  handleAddAuthorToProject,
  projectLanguages = [],
}) => {
  // Filter biographies by project languages
  const filteredBiographies = authorBiographies.filter(
    (bio) =>
      projectLanguages.length === 0 || projectLanguages.includes(bio.language),
  );
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            Urheber hinzufügen
          </DialogTitle>
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
              <SelectContent>
                {authors.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    {author.author_type === "person"
                      ? `${author.last_name}, ${author.first_name || ""}`
                      : author.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rolle</Label>
            <Select
              value={selectedAuthorRole || "Autor"}
              onValueChange={setSelectedAuthorRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rolle auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Autor">Autor</SelectItem>
                <SelectItem value="Illustrator">Illustrator</SelectItem>
                <SelectItem value="Übersetzer">Übersetzer</SelectItem>
                <SelectItem value="Herausgeber">Herausgeber</SelectItem>
                <SelectItem value="Mitarbeiter">Mitarbeiter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedAuthor && filteredBiographies.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="biography">Biografie (optional)</Label>
              </div>
              <Select
                value={selectedBiography || ""}
                onValueChange={setSelectedBiography}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Biografie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Keine Biografie zuordnen</SelectItem>
                  {filteredBiographies.map((bio) => (
                    <SelectItem key={bio.id} value={bio.id}>
                      <div className="flex flex-col">
                        <span>
                          {bio.biography_label || "Standard"}:{" "}
                          {bio.biography_text.length > 30
                            ? `${bio.biography_text.substring(0, 30)}...`
                            : bio.biography_text}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Sprache: {bio.language}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {projectLanguages.length > 0 &&
                authorBiographies.length > filteredBiographies.length && (
                  <p className="text-xs text-muted-foreground">
                    Nur Biografien in den Projektsprachen (
                    {projectLanguages.join(", ")}) werden angezeigt.
                  </p>
                )}
            </div>
          )}

          {selectedAuthor &&
            filteredBiographies.length === 0 &&
            authorBiographies.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Biografie</Label>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    Keine Biografien in den Projektsprachen (
                    {projectLanguages.join(", ")}) verfügbar. Bitte erstellen
                    Sie eine Biografie in einer der Projektsprachen.
                  </p>
                </div>
              </div>
            )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            <XIcon className="h-4 w-4 mr-2" />
            Abbrechen
          </Button>
          <Button
            type="button"
            disabled={!selectedAuthor || !selectedAuthorRole}
            onClick={handleAddAuthorToProject}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Hinzufügen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAuthorDialog;
