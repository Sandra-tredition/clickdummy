import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  BookOpen,
  Save,
  X,
  CalendarIcon,
  PlusCircle,
  User,
  FileText,
} from "lucide-react";
import {
  getBiographiesForAuthor,
  mockProjectAssignmentsWithBio,
} from "@/lib/mockData/authors";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { AuthorForm } from "@/components/Authors/AuthorForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

export type ProjectAssignment = {
  projectId: string;
  projectTitle: string;
  authorRole: string;
};

export type Author = {
  id: string;
  authorType: "person" | "organization";
  firstName?: string;
  lastName?: string;
  companyName?: string;
  isPseudonym?: boolean;
  isni?: string;
  profession?: string;
  company?: string;
  website?: string;
  birthDate?: Date | null;
  deathDate?: Date | null;
  projects?: ProjectAssignment[];
  biographiesCount?: number;
};

interface AuthorListProps {
  authors: Author[];
  onEdit: (author: Author) => void;
  onDelete: (authorId: string) => void;
  onUpdate: (data: any) => void;
}

// Schema for basic author data editing
const basicAuthorSchema = z
  .object({
    authorType: z.enum(["person", "organization"]),
    isPseudonym: z.boolean().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    birthDate: z.date().optional().nullable(),
    deathDate: z.date().optional().nullable(),
    isni: z.string().optional(),
    profession: z.string().optional(),
    company: z.string().optional(),
    website: z.string().optional(),
    companyName: z.string().optional(),
    additionalInfo: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.authorType === "person") {
        return !!data.lastName;
      } else if (data.authorType === "organization") {
        return !!data.companyName;
      }
      return true;
    },
    {
      message:
        "Entweder Nachname (für Personen) oder Firmenname (für Körperschaften) muss angegeben werden",
      path: ["lastName", "companyName"],
    },
  );

type BasicAuthorFormValues = z.infer<typeof basicAuthorSchema>;

// Schema for biography editing
const biographySchema = z.object({
  text: z.string().min(1, { message: "Biografie-Text ist erforderlich" }),
  label: z.string().min(1, { message: "Bezeichnung ist erforderlich" }),
  language: z.string().min(1, { message: "Sprache ist erforderlich" }),
});

type BiographyFormValues = z.infer<typeof biographySchema>;

const languageOptions = [
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
];

// Helper function to get full language name from language code
const getLanguageLabel = (languageCode: string): string => {
  // Handle common language codes that might be stored in the database
  const languageCodeMap: { [key: string]: string } = {
    de: "Deutsch",
    en: "Englisch",
    fr: "Französisch",
    es: "Spanisch",
    it: "Italienisch",
    nl: "Niederländisch",
    pl: "Polnisch",
    pt: "Portugiesisch",
    ru: "Russisch",
    zh: "Chinesisch",
    ja: "Japanisch",
  };

  // First check if it's a language code
  if (languageCodeMap[languageCode?.toLowerCase()]) {
    return languageCodeMap[languageCode.toLowerCase()];
  }

  // Then check if it's already a full language name
  const option = languageOptions.find((opt) => opt.value === languageCode);
  return option ? option.label : languageCode;
};

export function AuthorList({
  authors,
  onEdit,
  onDelete,
  onUpdate,
}: AuthorListProps) {
  const [editingAuthor, setEditingAuthor] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [activeBiographyTab, setActiveBiographyTab] = useState<{
    [key: string]: string;
  }>({});
  const [editingBasicData, setEditingBasicData] = useState<Author | null>(null);
  const [editingBiographies, setEditingBiographies] = useState<Author | null>(
    null,
  );
  const [isAddingBiography, setIsAddingBiography] = useState(false);
  const [editingBiographyIndex, setEditingBiographyIndex] = useState<
    number | null
  >(null);
  const [currentAuthorForBiography, setCurrentAuthorForBiography] =
    useState<Author | null>(null);

  const handleStartEdit = async (author: Author) => {
    // Get biographies for this author
    const biographiesData = getBiographiesForAuthor(author.id);

    // Format data for the form
    const formData = {
      authorType: author.authorType,
      firstName: author.firstName || "",
      lastName: author.lastName || "",
      companyName: author.companyName || "",
      isPseudonym: author.isPseudonym || false,
      birthDate: author.birthDate,
      deathDate: author.deathDate,
      isni: author.isni || "",
      profession: author.profession || "",
      company: author.company || "",
      website: author.website || "",
      additionalInfo: "",
      biographies:
        biographiesData && biographiesData.length > 0
          ? biographiesData.map((bio) => ({
              text: bio.biography_text,
              label: bio.biography_label || "Standard",
              language: bio.language || "Deutsch",
            }))
          : [{ text: "", label: "Standard", language: "Deutsch" }],
    };

    setEditFormData(formData);
    setEditingAuthor(author.id);
  };

  const handleCancelEdit = () => {
    setEditingAuthor(null);
    setEditFormData(null);
  };

  const handleSaveEdit = (data: any) => {
    onUpdate(data);
    setEditingAuthor(null);
    setEditFormData(null);
  };

  const handleEditBasicData = (author: Author) => {
    setEditingBasicData(author);
  };

  const handleEditBiographies = (author: Author) => {
    setEditingBiographies(author);
  };

  const handleSaveBasicData = async (data: BasicAuthorFormValues) => {
    if (!editingBasicData) return;

    // Transform data to match the expected format
    const transformedData = {
      authorType: data.authorType,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      companyName: data.companyName || "",
      isPseudonym: data.isPseudonym || false,
      birthDate: data.birthDate,
      deathDate: data.deathDate,
      isni: data.isni || "",
      profession: data.profession || "",
      company: data.company || "",
      website: data.website || "",
      additionalInfo: data.additionalInfo || "",
      biographies: [], // Keep existing biographies
    };

    onUpdate(transformedData);
    setEditingBasicData(null);
  };

  const handleSaveBiography = async (data: BiographyFormValues) => {
    if (!editingBiographies) return;

    const biographies = getBiographiesForAuthor(editingBiographies.id);
    let updatedBiographies;

    if (isAddingBiography) {
      // Add new biography
      updatedBiographies = [
        ...biographies.map((bio) => ({
          text: bio.biography_text,
          label: bio.biography_label || "Standard",
          language: bio.language || "Deutsch",
        })),
        data,
      ];
    } else if (editingBiographyIndex !== null) {
      // Update existing biography
      updatedBiographies = biographies.map((bio, index) => {
        if (index === editingBiographyIndex) {
          return data;
        }
        return {
          text: bio.biography_text,
          label: bio.biography_label || "Standard",
          language: bio.language || "Deutsch",
        };
      });
    }

    // Transform data to match the expected format
    const transformedData = {
      authorType: editingBiographies.authorType,
      firstName: editingBiographies.firstName || "",
      lastName: editingBiographies.lastName || "",
      companyName: editingBiographies.companyName || "",
      isPseudonym: editingBiographies.isPseudonym || false,
      birthDate: editingBiographies.birthDate,
      deathDate: editingBiographies.deathDate,
      isni: editingBiographies.isni || "",
      profession: editingBiographies.profession || "",
      company: editingBiographies.company || "",
      website: editingBiographies.website || "",
      additionalInfo: "",
      biographies: updatedBiographies,
    };

    onUpdate(transformedData);
    setEditingBiographies(null);
    setIsAddingBiography(false);
    setEditingBiographyIndex(null);
  };

  const handleAddBiography = (author: Author) => {
    setCurrentAuthorForBiography(author);
    setEditingBiographies(author);
    setIsAddingBiography(true);
    setEditingBiographyIndex(null);
  };

  const handleEditBiography = (author: Author, index: number) => {
    setCurrentAuthorForBiography(author);
    setEditingBiographies(author);
    setEditingBiographyIndex(index);
    setIsAddingBiography(false);
  };

  const handleDeleteBiography = async (index: number) => {
    if (!editingBiographies) return;

    const biographies = getBiographiesForAuthor(editingBiographies.id);
    const updatedBiographies = biographies
      .filter((_, i) => i !== index)
      .map((bio) => ({
        text: bio.biography_text,
        label: bio.biography_label || "Standard",
        language: bio.language || "Deutsch",
      }));

    // Transform data to match the expected format
    const transformedData = {
      authorType: editingBiographies.authorType,
      firstName: editingBiographies.firstName || "",
      lastName: editingBiographies.lastName || "",
      companyName: editingBiographies.companyName || "",
      isPseudonym: editingBiographies.isPseudonym || false,
      birthDate: editingBiographies.birthDate,
      deathDate: editingBiographies.deathDate,
      isni: editingBiographies.isni || "",
      profession: editingBiographies.profession || "",
      company: editingBiographies.company || "",
      website: editingBiographies.website || "",
      additionalInfo: "",
      biographies: updatedBiographies,
    };

    onUpdate(transformedData);
  };

  return (
    <div className="space-y-4">
      {authors.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Keine Urheber vorhanden
        </div>
      ) : (
        authors.map((author) => (
          <Card key={author.id} className="w-full border-2 shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={author.id} className="border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 min-h-[60px]">
                    <AccordionTrigger className="hover:no-underline flex-shrink-0 self-center"></AccordionTrigger>
                    <div className="flex items-center justify-between w-full self-center">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">
                          {author.authorType === "person"
                            ? `${author.lastName}, ${author.firstName || ""}`
                            : author.companyName}
                        </CardTitle>
                        {author.isPseudonym && (
                          <Badge variant="outline">Pseudonym</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mr-4">
                        <div className="flex items-center gap-1">
                          <BookOpen size={14} />
                          <span>
                            {author.projects ? author.projects.length : 0}{" "}
                            Projekte
                          </span>
                        </div>
                        <div className="flex items-center">
                          {author.biographiesCount || 0} Biografien
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <AccordionContent>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {/* Grunddaten Section */}
                      <div className="space-y-4">
                        <div className="relative flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                              <User size={16} />
                            </div>
                            <div>
                              <p className="font-medium">
                                {author.authorType === "person"
                                  ? `${author.firstName} ${author.lastName}`
                                  : author.companyName}
                                {author.isPseudonym && " (Pseudonym)"}
                              </p>
                              {author.authorType === "person" && (
                                <>
                                  {(author.birthDate || author.deathDate) && (
                                    <p className="text-sm text-muted-foreground">
                                      {author.birthDate &&
                                        format(
                                          new Date(author.birthDate),
                                          "dd.MM.yyyy",
                                        )}
                                      {" - "}
                                      {author.deathDate
                                        ? format(
                                            new Date(author.deathDate),
                                            "dd.MM.yyyy",
                                          )
                                        : ""}
                                    </p>
                                  )}
                                  {author.profession && (
                                    <p className="text-sm text-muted-foreground">
                                      {author.profession}
                                    </p>
                                  )}
                                  {author.company && (
                                    <p className="text-sm text-muted-foreground">
                                      {author.company}
                                    </p>
                                  )}
                                </>
                              )}
                              {author.isni && (
                                <p className="text-sm text-muted-foreground">
                                  ISNI: {author.isni}
                                </p>
                              )}
                              {author.website && (
                                <a
                                  href={author.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-black underline decoration-2 decoration-primary-green hover:decoration-4 transition-all"
                                >
                                  {author.website}
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBasicData(author)}
                            >
                              <Edit size={14} className="mr-1 sm:mr-1" />
                              <span className="hidden sm:inline">
                                Bearbeiten
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Biografien Section */}
                      {author.authorType === "person" && (
                        <div className="space-y-4">
                          <div className="relative rounded-lg border p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                                  <FileText size={16} />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">Biografien</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddBiography(author)}
                              >
                                <PlusCircle size={14} className="mr-1" />
                                <span className="hidden sm:inline">
                                  Neue Biografie anlegen
                                </span>
                              </Button>
                            </div>
                            {(() => {
                              const biographies = getBiographiesForAuthor(
                                author.id,
                              );
                              return biographies.length > 0 ? (
                                <div className="w-full">
                                  <div className="ml-20">
                                    <Tabs
                                      value={
                                        activeBiographyTab[author.id] ||
                                        biographies[0]?.biography_label ||
                                        "0"
                                      }
                                      onValueChange={(value) =>
                                        setActiveBiographyTab((prev) => ({
                                          ...prev,
                                          [author.id]: value,
                                        }))
                                      }
                                      className="w-full"
                                    >
                                      <div className="relative">
                                        <TabsList className="h-auto p-0 bg-transparent border-0 rounded-none w-full justify-start gap-1">
                                          {biographies.map((bio, index) => (
                                            <TabsTrigger
                                              key={index}
                                              value={
                                                bio.biography_label ||
                                                index.toString()
                                              }
                                              className="relative bg-gray-100 border border-gray-300 rounded-t-lg px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 data-[state=active]:bg-white data-[state=active]:border-gray-300 data-[state=active]:border-b-white data-[state=active]:z-10 data-[state=active]:shadow-sm -mb-px"
                                            >
                                              {bio.biography_label}
                                            </TabsTrigger>
                                          ))}
                                        </TabsList>
                                      </div>
                                      {biographies.map((bio, index) => (
                                        <TabsContent
                                          key={index}
                                          value={
                                            bio.biography_label ||
                                            index.toString()
                                          }
                                          className="mt-0 border border-gray-300 rounded-b-lg rounded-tr-lg bg-white"
                                        >
                                          <div className="p-4">
                                            <div className="flex items-start justify-between gap-4">
                                              <div className="flex-1">
                                                <div className="flex items-center mb-3">
                                                  <Badge
                                                    variant="secondary"
                                                    className="bg-gray-500 text-white rounded-full font-normal"
                                                    style={{
                                                      backgroundColor:
                                                        "#fff9d6",
                                                      color: "black",
                                                    }}
                                                  >
                                                    {getLanguageLabel(
                                                      bio.language,
                                                    )}
                                                  </Badge>
                                                </div>
                                                <p className="text-sm leading-relaxed text-gray-500">
                                                  {bio.biography_text}
                                                </p>
                                              </div>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  handleEditBiography(
                                                    author,
                                                    index,
                                                  )
                                                }
                                              >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Bearbeiten
                                              </Button>
                                            </div>
                                          </div>
                                        </TabsContent>
                                      ))}
                                    </Tabs>
                                  </div>
                                </div>
                              ) : (
                                <div className="ml-20">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                      Keine Biografien vorhanden
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                      {/* Zugeordnete Projekte Section */}
                      {author.projects && author.projects.length > 0 && (
                        <div className="space-y-4">
                          <div className="relative rounded-lg border p-4">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                                <BookOpen size={16} />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">
                                  Zugeordnete Projekte
                                </p>
                              </div>
                            </div>
                            <div className="ml-20 space-y-3">
                              {author.projects.map((project, projectIndex) => {
                                // Find the project assignment with biography info
                                const projectAssignmentWithBio =
                                  mockProjectAssignmentsWithBio?.find(
                                    (assignment) =>
                                      assignment.author_id === author.id &&
                                      assignment.project_id ===
                                        project.projectId,
                                  );

                                // Get the biography if assigned
                                const assignedBiography =
                                  projectAssignmentWithBio?.biography_id
                                    ? getBiographiesForAuthor(author.id).find(
                                        (bio) =>
                                          bio.id ===
                                          projectAssignmentWithBio.biography_id,
                                      )
                                    : null;

                                return (
                                  <div
                                    key={projectIndex}
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded border"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-8 w-8 items-center justify-center rounded bg-white">
                                        <BookOpen size={14} />
                                      </div>
                                      <div>
                                        <Link
                                          to={`/project/${project.projectId}`}
                                          className="font-medium text-black underline decoration-2 decoration-primary-green hover:decoration-4 transition-all"
                                        >
                                          {project.projectTitle}
                                        </Link>
                                        <p className="text-sm text-muted-foreground">
                                          Rolle: {project.authorRole}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {assignedBiography ? (
                                        <Badge
                                          variant="secondary"
                                          className="rounded-full font-normal"
                                          style={{
                                            backgroundColor: "#fff9d6",
                                            color: "black",
                                          }}
                                        >
                                          Biografie:{" "}
                                          {assignedBiography.biography_label}
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="secondary"
                                          className="rounded-full font-normal"
                                          style={{
                                            backgroundColor: "#ffffff",
                                            color: "black",
                                          }}
                                        >
                                          Ohne Biografie
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Delete Button */}
                      <div className="mt-6 pt-4 border-t flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(author.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Urheber löschen
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        ))
      )}

      {/* Basic Data Edit Modal */}
      <Dialog
        open={!!editingBasicData}
        onOpenChange={(open) => !open && setEditingBasicData(null)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Grunddaten bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeite die Grunddaten des Urhebers.
            </DialogDescription>
          </DialogHeader>
          {editingBasicData && (
            <BasicDataForm
              author={editingBasicData}
              onSave={handleSaveBasicData}
              onCancel={() => setEditingBasicData(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Biographies Edit Modal */}
      <Dialog
        open={!!editingBiographies}
        onOpenChange={(open) => !open && setEditingBiographies(null)}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Biografien bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeite die Biografien des Urhebers.
            </DialogDescription>
          </DialogHeader>
          {editingBiographies && (
            <BiographiesForm
              author={editingBiographies}
              onSave={handleSaveBiography}
              onCancel={() => {
                setEditingBiographies(null);
                setIsAddingBiography(false);
                setEditingBiographyIndex(null);
              }}
              onAddBiography={() => handleAddBiography(editingBiographies!)}
              onEditBiography={(index) =>
                handleEditBiography(editingBiographies!, index)
              }
              onDeleteBiography={handleDeleteBiography}
              isAddingBiography={isAddingBiography}
              editingBiographyIndex={editingBiographyIndex}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Basic Data Form Component
const BasicDataForm = ({
  author,
  onSave,
  onCancel,
}: {
  author: Author;
  onSave: (data: BasicAuthorFormValues) => void;
  onCancel: () => void;
}) => {
  const form = useForm<BasicAuthorFormValues>({
    resolver: zodResolver(basicAuthorSchema),
    defaultValues: {
      authorType: author.authorType,
      firstName: author.firstName || "",
      lastName: author.lastName || "",
      companyName: author.companyName || "",
      isPseudonym: author.isPseudonym || false,
      birthDate: author.birthDate,
      deathDate: author.deathDate,
      isni: author.isni || "",
      profession: author.profession || "",
      company: author.company || "",
      website: author.website || "",
      additionalInfo: "",
    },
  });

  const authorType = form.watch("authorType");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="authorType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Art des Urhebers</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="person" />
                    </FormControl>
                    <FormLabel className="font-normal">Person</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="organization" />
                    </FormControl>
                    <FormLabel className="font-normal">Körperschaft</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {authorType === "person" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vorname</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Vorname"
                          maxLength={120}
                          {...field}
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                          {field.value?.length || 0}/120
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nachname*</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Nachname"
                          maxLength={120}
                          {...field}
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                          {field.value?.length || 0}/120
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isPseudonym"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Pseudonym</FormLabel>
                    <FormDescription>
                      Handelt es sich bei diesem Namen um ein Pseudonym?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Geburtsdatum</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd.MM.yyyy")
                            ) : (
                              <span>Datum auswählen</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() ||
                            (form.getValues("deathDate") &&
                              date > form.getValues("deathDate")!)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deathDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Sterbedatum</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd.MM.yyyy")
                            ) : (
                              <span>Datum auswählen</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() ||
                            (form.getValues("birthDate") &&
                              date < form.getValues("birthDate")!)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beruf</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Beruf"
                        maxLength={120}
                        {...field}
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                        {field.value?.length || 0}/120
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {authorType === "organization" && (
          <>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name der Körperschaft*</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Name der Körperschaft"
                        maxLength={200}
                        {...field}
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                        {field.value?.length || 0}/200
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weiterführende Informationen*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Weiterführende Informationen zur Körperschaft"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISNI</FormLabel>
                <FormControl>
                  <Input placeholder="ISNI" {...field} />
                </FormControl>
                <FormDescription>
                  International Standard Name Identifier
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Abbrechen
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Biographies Form Component
const BiographiesForm = ({
  author,
  onSave,
  onCancel,
  onAddBiography,
  onEditBiography,
  onDeleteBiography,
  isAddingBiography,
  editingBiographyIndex,
}: {
  author: Author;
  onSave: (data: BiographyFormValues) => void;
  onCancel: () => void;
  onAddBiography: () => void;
  onEditBiography: (index: number) => void;
  onDeleteBiography: (index: number) => void;
  isAddingBiography: boolean;
  editingBiographyIndex: number | null;
}) => {
  const biographies = getBiographiesForAuthor(author.id);
  const [activeBiographyTab, setActiveBiographyTab] = useState(
    biographies[0]?.biography_label || "0",
  );

  const form = useForm<BiographyFormValues>({
    resolver: zodResolver(biographySchema),
    defaultValues: {
      text:
        editingBiographyIndex !== null
          ? biographies[editingBiographyIndex]?.biography_text || ""
          : "",
      label:
        editingBiographyIndex !== null
          ? biographies[editingBiographyIndex]?.biography_label || "Standard"
          : "Standard",
      language:
        editingBiographyIndex !== null
          ? biographies[editingBiographyIndex]?.language || "Deutsch"
          : "Deutsch",
    },
  });

  // Reset form when editing index changes
  React.useEffect(() => {
    if (isAddingBiography) {
      form.reset({
        text: "",
        label: "Standard",
        language: "Deutsch",
      });
    } else if (editingBiographyIndex !== null) {
      const bio = biographies[editingBiographyIndex];
      if (bio) {
        form.reset({
          text: bio.biography_text,
          label: bio.biography_label || "Standard",
          language: bio.language || "Deutsch",
        });
      }
    }
  }, [isAddingBiography, editingBiographyIndex, biographies, form]);

  const handleFormSubmit = (data: BiographyFormValues) => {
    onSave(data);
    form.reset();
  };

  if (isAddingBiography || editingBiographyIndex !== null) {
    return (
      <div className="space-y-4">
        <h4 className="font-medium">
          {isAddingBiography
            ? "Neue Biografie hinzufügen"
            : "Biografie bearbeiten"}
        </h4>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bezeichnung</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="z.B. Kurzvita, Langvita, Für Kinderbuch"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sprache</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sprache auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languageOptions.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Biografische Angaben"
                        className="resize-none pr-16 min-h-[120px]"
                        maxLength={3000}
                        {...field}
                      />
                      <span className="absolute right-3 top-3 text-xs text-muted-foreground">
                        {field.value?.length || 0}/3000
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Abbrechen
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Speichern
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {biographies.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Vorhandene Biografien</h4>
            <Button variant="outline" size="sm" onClick={onAddBiography}>
              <Plus className="h-4 w-4 mr-2" />
              Neue Biografie hinzufügen
            </Button>
          </div>
          <Tabs
            value={activeBiographyTab}
            onValueChange={setActiveBiographyTab}
            className="w-full"
          >
            <TabsList className="h-auto p-0 bg-transparent border-0 rounded-none w-full justify-start gap-1">
              {biographies.map((bio, index) => (
                <TabsTrigger
                  key={index}
                  value={bio.biography_label || index.toString()}
                  className="relative bg-gray-100 border border-gray-300 rounded-t-lg px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 data-[state=active]:bg-white data-[state=active]:border-gray-300 data-[state=active]:border-b-white data-[state=active]:z-10 data-[state=active]:shadow-sm -mb-px"
                >
                  {bio.biography_label}
                </TabsTrigger>
              ))}
            </TabsList>
            {biographies.map((bio, index) => (
              <TabsContent
                key={index}
                value={bio.biography_label || index.toString()}
                className="mt-0 border border-gray-300 rounded-b-lg rounded-tr-lg bg-white p-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className="bg-gray-500 text-white rounded-full font-normal"
                        style={{
                          backgroundColor: "#fff9d6",
                          color: "black",
                        }}
                      >
                        {getLanguageLabel(bio.language)}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditBiography(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteBiography(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded border mt-3">
                    <p className="text-sm leading-relaxed">
                      {bio.biography_text}
                    </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Keine Biografien vorhanden
          </p>
          <Button variant="outline" onClick={onAddBiography}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Erste Biografie hinzufügen
          </Button>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Schließen
        </Button>
      </div>
    </div>
  );
};
