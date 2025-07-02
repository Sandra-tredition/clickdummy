import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
}

const NewAuthorDialog: React.FC<NewAuthorDialogProps> = ({
  isOpen,
  onOpenChange,
  onAuthorCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Call the callback with the new author data
      onAuthorCreated({
        author: newAuthor,
        biographies: biographies,
      });

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
        <div className="py-4">
          <AuthorForm onSubmit={handleSubmit} isEmbedded={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewAuthorDialog;
