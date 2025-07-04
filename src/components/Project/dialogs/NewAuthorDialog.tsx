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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthorForm } from "@/components/Authors/AuthorForm";
import { XIcon, SaveIcon } from "lucide-react";

interface NewAuthorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAuthorCreated: (authorData: any) => void;
  onAuthorCreatedWithRole?: (authorData: any, role: string) => void;
  showRoleSelection?: boolean;
}

const NewAuthorDialog: React.FC<NewAuthorDialogProps> = ({
  isOpen,
  onOpenChange,
  onAuthorCreated,
  onAuthorCreatedWithRole,
  showRoleSelection = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Autor");

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      // Generate a temporary ID for the new author
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create author object with the form data
      const newAuthor = {
        id: tempId,
        author_type: data.authorType,
        first_name: data.firstName || null,
        last_name: data.lastName || null,
        company_name: data.companyName || null,
        is_pseudonym: data.isPseudonym || false,
        birth_date: data.birthDate
          ? data.birthDate.toISOString().split("T")[0]
          : null,
        death_date: data.deathDate
          ? data.deathDate.toISOString().split("T")[0]
          : null,
        isni: data.isni || null,
        profession: data.profession || null,
        company: data.company || null,
        website: data.website || null,
        additional_info: data.additionalInfo || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Create biographies array
      const biographies =
        data.biographies?.map((bio: any, index: number) => ({
          id: `temp-bio-${tempId}-${index}`,
          author_id: tempId,
          biography_text: bio.text,
          biography_label: bio.label,
          language: bio.language || "Deutsch",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })) || [];

      // Call the appropriate callback with the new author data
      if (showRoleSelection && onAuthorCreatedWithRole) {
        onAuthorCreatedWithRole(
          {
            author: newAuthor,
            biographies: biographies,
          },
          selectedRole,
        );
      } else {
        onAuthorCreated({
          author: newAuthor,
          biographies: biographies,
        });
      }

      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating author:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            Neuen Urheber anlegen
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <AuthorForm
            onSubmit={handleSubmit}
            isEmbedded={true}
            showSubmitButton={false}
          />
        </div>
        {showRoleSelection && (
          <div className="px-6 pb-4 space-y-2 border-t pt-4">
            <Label htmlFor="role">Rolle im Projekt</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Rolle auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Autor">Autor</SelectItem>
                <SelectItem value="Co-Autor">Co-Autor</SelectItem>
                <SelectItem value="Herausgeber">Herausgeber</SelectItem>
                <SelectItem value="Übersetzer">Übersetzer</SelectItem>
                <SelectItem value="Illustrator">Illustrator</SelectItem>
                <SelectItem value="Lektor">Lektor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <XIcon className="h-4 w-4 mr-2" />
            Abbrechen
          </Button>
          <Button type="submit" form="author-form" disabled={isSubmitting}>
            <SaveIcon className="h-4 w-4 mr-2" />
            {isSubmitting ? "Speichern..." : "Speichern"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewAuthorDialog;
