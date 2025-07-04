import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";

import { AuthorForm } from "@/components/Authors/AuthorForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  PlusCircle,
  Edit,
  Trash2,
  BookOpen,
  User,
  Building,
  CalendarIcon,
  Save,
  X,
  Search,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  mockAuthors,
  getBiographiesForAuthor,
  getProjectAssignmentsForAuthor,
  mockProjectAssignmentsWithBio,
  searchAuthors,
} from "@/lib/mockData/authors";
import { AuthorList } from "@/components/Authors/AuthorList";

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

interface AuthorsProps {
  isEmbedded?: boolean;
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

const Authors = ({ isEmbedded = false }: AuthorsProps = {}) => {
  const location = useLocation();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingAuthor, setIsCreatingAuthor] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isEditingBasicData, setIsEditingBasicData] = useState(false);
  const [isEditingBiography, setIsEditingBiography] = useState(false);
  const [editingBiographyIndex, setEditingBiographyIndex] = useState<
    number | null
  >(null);
  const [isAddingBiography, setIsAddingBiography] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [editAuthorFormData, setEditAuthorFormData] = useState<any>(null);

  // Filter authors based on search term
  const filteredAuthors = searchTerm
    ? searchAuthors(searchTerm).map((author) => {
        // Get biography count for this author
        const biographiesCount = getBiographiesForAuthor(author.id).length;

        // Get project assignments for this author
        const projectAssignments = getProjectAssignmentsForAuthor(author.id);
        const projects = projectAssignments.map((assignment) => ({
          projectId: assignment.project_id,
          projectTitle: assignment.project_title,
          authorRole: assignment.author_role,
        }));

        return {
          id: author.id,
          authorType: author.author_type,
          firstName: author.first_name,
          lastName: author.last_name,
          companyName: author.company_name,
          isPseudonym: author.is_pseudonym,
          isni: author.isni,
          profession: author.profession,
          company: author.company,
          website: author.website,
          birthDate: author.birth_date ? new Date(author.birth_date) : null,
          deathDate: author.death_date ? new Date(author.death_date) : null,
          projects: projects,
          biographiesCount: biographiesCount,
        };
      })
    : authors;

  // Load mock authors data
  const fetchAuthors = async () => {
    setIsLoading(true);
    try {
      // Check if current user is the clean user (no mock data)
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null",
      );
      const isCleanUser = currentUser?.email === "clean@example.com";

      if (isCleanUser) {
        console.log("Clean user detected - no mock authors will be shown");
        setAuthors([]);
        setSelectedAuthor(null);
        setIsLoading(false);
        return;
      }

      // Use mock data instead of Supabase
      const authorsWithProjects = mockAuthors.map((author) => {
        // Get biography count for this author
        const biographiesCount = getBiographiesForAuthor(author.id).length;

        // Get project assignments for this author
        const projectAssignments = getProjectAssignmentsForAuthor(author.id);
        const projects = projectAssignments.map((assignment) => ({
          projectId: assignment.project_id,
          projectTitle: assignment.project_title,
          authorRole: assignment.author_role,
        }));

        return {
          id: author.id,
          authorType: author.author_type,
          firstName: author.first_name,
          lastName: author.last_name,
          companyName: author.company_name,
          isPseudonym: author.is_pseudonym,
          isni: author.isni,
          profession: author.profession,
          company: author.company,
          website: author.website,
          birthDate: author.birth_date ? new Date(author.birth_date) : null,
          deathDate: author.death_date ? new Date(author.death_date) : null,
          projects: projects,
          biographiesCount: biographiesCount,
        };
      });

      setAuthors(authorsWithProjects);
      // Select first author by default
      if (authorsWithProjects.length > 0 && !selectedAuthor) {
        setSelectedAuthor(authorsWithProjects[0]);
      }
    } catch (error) {
      console.error("Error loading mock authors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  // Handle URL parameters for author selection
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    const params = new URLSearchParams(
      hash.includes("&") ? hash.split("&").slice(1).join("&") : "",
    );
    const authorId = params.get("authorId");

    if (authorId && authors.length > 0) {
      const targetAuthor = authors.find((author) => author.id === authorId);
      if (targetAuthor) {
        setSelectedAuthor(targetAuthor);
        // Automatically start editing the author
        handleStartEdit(targetAuthor);
      }
    }
  }, [location.hash, authors]);

  const handleCreateAuthor = async (data: any) => {
    try {
      // Prepare author data with default values for required fields
      const authorInsert = {
        author_type: data.authorType,
        first_name: data.firstName || "",
        last_name: data.lastName || "",
        company_name: data.companyName || "",
        is_pseudonym: data.isPseudonym || false,
        birth_date: data.birthDate || null,
        death_date: data.deathDate || null,
        isni: data.isni || "",
        profession: data.profession || "",
        company: data.company || "",
        website: data.website || "",
        additional_info: data.additionalInfo || "",
      };

      // Insert author data
      const { data: authorData, error: authorError } = await supabase
        .from("authors")
        .insert([authorInsert])
        .select();

      if (authorError) throw authorError;

      // Insert biographies if any
      if (
        data.biographies &&
        data.biographies.length > 0 &&
        authorData &&
        authorData[0]
      ) {
        const biographyInserts = data.biographies
          .filter((bio: any) => bio.text && bio.text.trim() !== "")
          .map((bio: any) => ({
            author_id: authorData[0].id,
            biography_text: bio.text || "",
            biography_label: bio.label || "Standard",
            language: bio.language || "Deutsch",
          }));

        if (biographyInserts.length > 0) {
          const { error: bioError } = await supabase
            .from("author_biographies")
            .insert(biographyInserts);

          if (bioError) throw bioError;
        } else {
          // Always create at least one default biography for persons
          if (data.authorType === "person") {
            const { error: bioError } = await supabase
              .from("author_biographies")
              .insert([
                {
                  author_id: authorData[0].id,
                  biography_text: "Keine Biografie vorhanden.",
                  biography_label: "Standard",
                  language: "Deutsch",
                },
              ]);

            if (bioError) throw bioError;
          }
        }
      } else if (data.authorType === "person" && authorData && authorData[0]) {
        // Create a default biography if none provided for persons
        const { error: bioError } = await supabase
          .from("author_biographies")
          .insert([
            {
              author_id: authorData[0].id,
              biography_text: "Keine Biografie vorhanden.",
              biography_label: "Standard",
              language: "Deutsch",
            },
          ]);

        if (bioError) throw bioError;
      }

      setIsCreatingAuthor(false);
      fetchAuthors();
    } catch (error) {
      console.error("Error creating author:", error);
    }
  };

  const handleCancelCreateAuthor = () => {
    setIsCreatingAuthor(false);
  };

  const handleUpdateAuthor = async (data: any) => {
    if (!selectedAuthor) return;

    try {
      // Update author data
      const { error: authorError } = await supabase
        .from("authors")
        .update({
          author_type: data.authorType,
          first_name: data.firstName,
          last_name: data.lastName,
          company_name: data.companyName,
          is_pseudonym: data.isPseudonym,
          birth_date: data.birthDate,
          death_date: data.deathDate,
          isni: data.isni,
          profession: data.profession,
          company: data.company,
          website: data.website,
          additional_info: data.additionalInfo,
          updated_at: new Date(),
        })
        .eq("id", selectedAuthor.id);

      if (authorError) throw authorError;

      // Fetch existing biographies
      const { data: existingBios, error: fetchBioError } = await supabase
        .from("author_biographies")
        .select("*")
        .eq("author_id", selectedAuthor.id);

      if (fetchBioError) throw fetchBioError;

      // Delete existing biographies
      if (existingBios && existingBios.length > 0) {
        const { error: deleteBioError } = await supabase
          .from("author_biographies")
          .delete()
          .eq("author_id", selectedAuthor.id);

        if (deleteBioError) throw deleteBioError;
      }

      // Insert new biographies
      if (data.biographies && data.biographies.length > 0) {
        const biographyInserts = data.biographies
          .filter((bio: any) => bio.text.trim() !== "")
          .map((bio: any) => ({
            author_id: selectedAuthor.id,
            biography_text: bio.text,
            biography_label: bio.label,
            language: bio.language || "Deutsch",
          }));

        if (biographyInserts.length > 0) {
          const { error: bioError } = await supabase
            .from("author_biographies")
            .insert(biographyInserts);

          if (bioError) throw bioError;
        }
      }

      fetchAuthors();
      // Update selected author
      const updatedAuthor = authors.find((a) => a.id === selectedAuthor.id);
      if (updatedAuthor) {
        setSelectedAuthor(updatedAuthor);
      }
    } catch (error) {
      console.error("Error updating author:", error);
    }
  };

  const handleDeleteAuthor = async () => {
    if (!authorToDelete) return;

    try {
      const { error } = await supabase
        .from("authors")
        .delete()
        .eq("id", authorToDelete);

      if (error) throw error;

      setDeleteDialogOpen(false);
      setAuthorToDelete(null);
      fetchAuthors();
    } catch (error) {
      console.error("Error deleting author:", error);
    }
  };

  const handleEditBasicData = () => {
    setIsEditingBasicData(true);
  };

  const handleCancelBasicDataEdit = () => {
    setIsEditingBasicData(false);
  };

  const handleSaveBasicData = async (data: BasicAuthorFormValues) => {
    if (!selectedAuthor) return;

    try {
      // Update author data
      const { error: authorError } = await supabase
        .from("authors")
        .update({
          author_type: data.authorType,
          first_name: data.firstName,
          last_name: data.lastName,
          company_name: data.companyName,
          is_pseudonym: data.isPseudonym,
          birth_date: data.birthDate,
          death_date: data.deathDate,
          isni: data.isni,
          profession: data.profession,
          company: data.company,
          website: data.website,
          additional_info: data.additionalInfo,
          updated_at: new Date(),
        })
        .eq("id", selectedAuthor.id);

      if (authorError) throw authorError;

      fetchAuthors();
      setIsEditingBasicData(false);
      // Update selected author
      const updatedAuthor = authors.find((a) => a.id === selectedAuthor.id);
      if (updatedAuthor) {
        setSelectedAuthor(updatedAuthor);
      }
    } catch (error) {
      console.error("Error updating author:", error);
    }
  };

  const handleEditBiography = (index: number) => {
    setEditingBiographyIndex(index);
    setIsEditingBiography(true);
  };

  const handleCancelBiographyEdit = () => {
    setIsEditingBiography(false);
    setEditingBiographyIndex(null);
    setIsAddingBiography(false);
  };

  const handleSaveBiography = async (data: BiographyFormValues) => {
    if (!selectedAuthor) return;

    try {
      const biographies = getBiographiesForAuthor(selectedAuthor.id);

      if (isAddingBiography) {
        // Add new biography
        const { error: bioError } = await supabase
          .from("author_biographies")
          .insert([
            {
              author_id: selectedAuthor.id,
              biography_text: data.text,
              biography_label: data.label,
              language: data.language,
            },
          ]);

        if (bioError) throw bioError;
      } else if (editingBiographyIndex !== null) {
        // Update existing biography
        const biographyToUpdate = biographies[editingBiographyIndex];
        if (biographyToUpdate) {
          const { error: bioError } = await supabase
            .from("author_biographies")
            .update({
              biography_text: data.text,
              biography_label: data.label,
              language: data.language,
            })
            .eq("id", biographyToUpdate.id);

          if (bioError) throw bioError;
        }
      }

      fetchAuthors();
      setIsEditingBiography(false);
      setEditingBiographyIndex(null);
      setIsAddingBiography(false);
    } catch (error) {
      console.error("Error saving biography:", error);
    }
  };

  const handleDeleteBiography = async (index: number) => {
    if (!selectedAuthor) return;

    try {
      const biographies = getBiographiesForAuthor(selectedAuthor.id);
      const biographyToDelete = biographies[index];

      if (biographyToDelete) {
        const { error } = await supabase
          .from("author_biographies")
          .delete()
          .eq("id", biographyToDelete.id);

        if (error) throw error;
        fetchAuthors();
      }
    } catch (error) {
      console.error("Error deleting biography:", error);
    }
  };

  const handleAddBiography = () => {
    setIsAddingBiography(true);
    setIsEditingBiography(true);
  };

  const handleOpenDeleteDialog = (authorId: string) => {
    setAuthorToDelete(authorId);
    setDeleteDialogOpen(true);
  };

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

    setEditAuthorFormData(formData);
    setEditingAuthor(author);
  };

  const handleCancelEdit = () => {
    setEditingAuthor(null);
    setEditAuthorFormData(null);
  };

  const handleSaveEdit = async (data: any) => {
    if (!editingAuthor) return;

    try {
      // Update author data
      const { error: authorError } = await supabase
        .from("authors")
        .update({
          author_type: data.authorType,
          first_name: data.firstName,
          last_name: data.lastName,
          company_name: data.companyName,
          is_pseudonym: data.isPseudonym,
          birth_date: data.birthDate,
          death_date: data.deathDate,
          isni: data.isni,
          profession: data.profession,
          company: data.company,
          website: data.website,
          additional_info: data.additionalInfo,
          updated_at: new Date(),
        })
        .eq("id", editingAuthor.id);

      if (authorError) throw authorError;

      // Fetch existing biographies
      const { data: existingBios, error: fetchBioError } = await supabase
        .from("author_biographies")
        .select("*")
        .eq("author_id", editingAuthor.id);

      if (fetchBioError) throw fetchBioError;

      // Delete existing biographies
      if (existingBios && existingBios.length > 0) {
        const { error: deleteBioError } = await supabase
          .from("author_biographies")
          .delete()
          .eq("author_id", editingAuthor.id);

        if (deleteBioError) throw deleteBioError;
      }

      // Insert new biographies
      if (data.biographies && data.biographies.length > 0) {
        const biographyInserts = data.biographies
          .filter((bio: any) => bio.text.trim() !== "")
          .map((bio: any) => ({
            author_id: editingAuthor.id,
            biography_text: bio.text,
            biography_label: bio.label,
            language: bio.language || "Deutsch",
          }));

        if (biographyInserts.length > 0) {
          const { error: bioError } = await supabase
            .from("author_biographies")
            .insert(biographyInserts);

          if (bioError) throw bioError;
        }
      }

      fetchAuthors();
      setEditingAuthor(null);
      setEditAuthorFormData(null);
    } catch (error) {
      console.error("Error updating author:", error);
    }
  };

  const BasicDataForm = ({ author }: { author: Author }) => {
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
        <form
          onSubmit={form.handleSubmit(handleSaveBasicData)}
          className="space-y-4"
        >
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
                      <FormLabel className="font-normal">
                        Körperschaft
                      </FormLabel>
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

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelBasicDataEdit}
            >
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

  const BiographyForm = ({
    biography,
    index,
  }: {
    biography?: any;
    index?: number;
  }) => {
    const form = useForm<BiographyFormValues>({
      resolver: zodResolver(biographySchema),
      defaultValues: {
        text: biography?.biography_text || "",
        label: biography?.biography_label || "Standard",
        language: biography?.language || "Deutsch",
      },
    });

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSaveBiography)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bezeichnung*</FormLabel>
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
                  <FormLabel>Sprache*</FormLabel>
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
                <FormLabel>Text*</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Biografische Angaben"
                      className="resize-none pr-16"
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

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelBiographyEdit}
            >
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

  const renderAuthorDetails = () => {
    if (!selectedAuthor) return null;

    const biographies = getBiographiesForAuthor(selectedAuthor.id);

    return (
      <div className="space-y-6">
        {/* Basic Data Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">
              {selectedAuthor.authorType === "person"
                ? `${selectedAuthor.lastName}, ${selectedAuthor.firstName || ""}`
                : selectedAuthor.companyName}
              {selectedAuthor.isPseudonym && (
                <Badge variant="outline" className="ml-2">
                  Pseudonym
                </Badge>
              )}
            </CardTitle>
            <div className="flex space-x-2">
              {!isEditingBasicData && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditBasicData}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpenDeleteDialog(selectedAuthor.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditingBasicData ? (
              <BasicDataForm author={selectedAuthor} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedAuthor.authorType === "person" ? (
                  <>
                    <div>
                      <span className="text-sm font-medium block">Name:</span>
                      <span>
                        {selectedAuthor.firstName} {selectedAuthor.lastName}
                      </span>
                    </div>
                    {(selectedAuthor.birthDate || selectedAuthor.deathDate) && (
                      <div>
                        <span className="text-sm font-medium block">
                          Lebensdaten:
                        </span>
                        <span>
                          {selectedAuthor.birthDate &&
                            format(
                              new Date(selectedAuthor.birthDate),
                              "dd.MM.yyyy",
                            )}
                          {" - "}
                          {selectedAuthor.deathDate
                            ? format(
                                new Date(selectedAuthor.deathDate),
                                "dd.MM.yyyy",
                              )
                            : ""}
                        </span>
                      </div>
                    )}
                    {selectedAuthor.profession && (
                      <div>
                        <span className="text-sm font-medium block">
                          Beruf:
                        </span>
                        <span>{selectedAuthor.profession}</span>
                      </div>
                    )}
                    {selectedAuthor.company && (
                      <div>
                        <span className="text-sm font-medium block">
                          Firma:
                        </span>
                        <span>{selectedAuthor.company}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <span className="text-sm font-medium block">
                      Körperschaft:
                    </span>
                    <span>{selectedAuthor.companyName}</span>
                  </div>
                )}
                {selectedAuthor.isni && (
                  <div>
                    <span className="text-sm font-medium block">ISNI:</span>
                    <span>{selectedAuthor.isni}</span>
                  </div>
                )}
                {selectedAuthor.website && (
                  <div>
                    <span className="text-sm font-medium block">Website:</span>
                    <a
                      href={selectedAuthor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black underline decoration-2 decoration-primary-green hover:decoration-4 transition-all"
                    >
                      {selectedAuthor.website}
                    </a>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Biographies/Additional Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {selectedAuthor.authorType === "person"
                ? "Biografien"
                : "Weiterführende Informationen"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAuthor.authorType === "person" ? (
              <>
                {isEditingBiography &&
                (isAddingBiography || editingBiographyIndex !== null) ? (
                  <div className="mb-6">
                    <h4 className="font-medium mb-4">
                      {isAddingBiography
                        ? "Neue Biografie hinzufügen"
                        : "Biografie bearbeiten"}
                    </h4>
                    <BiographyForm
                      biography={
                        editingBiographyIndex !== null
                          ? biographies[editingBiographyIndex]
                          : undefined
                      }
                      index={editingBiographyIndex || undefined}
                    />
                  </div>
                ) : (
                  <>
                    {biographies.length > 0 ? (
                      <Tabs
                        defaultValue={biographies[0]?.biography_label || "0"}
                        className="w-full"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <TabsList className="h-auto p-1 bg-muted rounded-lg">
                            {biographies.map((bio, index) => (
                              <TabsTrigger
                                key={index}
                                value={bio.biography_label || index.toString()}
                                className="rounded-md px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-0"
                              >
                                {bio.biography_label}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddBiography}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Neue Biografie
                          </Button>
                        </div>
                        {biographies.map((bio, index) => (
                          <TabsContent
                            key={index}
                            value={bio.biography_label || index.toString()}
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">
                                    {bio.language.toUpperCase()}
                                  </Badge>
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditBiography(index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteBiography(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm leading-relaxed">
                                {bio.biography_text}
                              </p>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          Keine Biografien vorhanden
                        </p>
                        <Button variant="outline" onClick={handleAddBiography}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Erste Biografie hinzufügen
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">
                Keine zusätzlichen Informationen vorhanden
              </p>
            )}
          </CardContent>
        </Card>

        {/* Projects Section */}
        {selectedAuthor.projects && selectedAuthor.projects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Zugeordnete Projekte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedAuthor.projects.map((project, projectIndex) => {
                  // Find the project assignment with biography info
                  const projectAssignmentWithBio =
                    mockProjectAssignmentsWithBio.find(
                      (assignment) =>
                        assignment.author_id === selectedAuthor.id &&
                        assignment.project_id === project.projectId,
                    );

                  // Get the biography if assigned
                  const assignedBiography =
                    projectAssignmentWithBio?.biography_id
                      ? getBiographiesForAuthor(selectedAuthor.id).find(
                          (bio) =>
                            bio.id === projectAssignmentWithBio.biography_id,
                        )
                      : null;

                  return (
                    <div
                      key={projectIndex}
                      className="flex items-center justify-between bg-slate-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <BookOpen
                          size={16}
                          className="text-muted-foreground flex-shrink-0"
                        />
                        <div>
                          <Link
                            to={`/project/${project.projectId}`}
                            className="text-sm font-medium text-black underline decoration-2 decoration-primary-green hover:decoration-4 transition-all"
                          >
                            {project.projectTitle}
                          </Link>
                          <div className="text-xs text-muted-foreground mt-1">
                            Rolle: {project.authorRole}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {assignedBiography ? (
                          <Badge variant="default" className="text-xs">
                            Biografie: {assignedBiography.biography_label}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs text-muted-foreground"
                          >
                            Ohne Biografie
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  if (isEmbedded) {
    return (
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Urheber werden geladen...</p>
          </div>
        ) : (
          <>
            <AuthorList
              authors={filteredAuthors}
              onEdit={handleStartEdit}
              onDelete={handleOpenDeleteDialog}
              onUpdate={handleSaveEdit}
            />
            {filteredAuthors.length === 0 && (
              <Card>
                <CardContent className="text-center py-12 text-muted-foreground">
                  Keine Urheber vorhanden
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    );
  }

  const content = (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Urheber werden geladen...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search and Create Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Urheber</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setIsCreatingAuthor(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Neuen Urheber anlegen
            </Button>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <Card>
              <CardContent className="pt-6">
                <Input
                  placeholder="Urheber suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>
          )}

          {/* Authors List */}
          <AuthorList
            authors={filteredAuthors}
            onEdit={handleStartEdit}
            onDelete={handleOpenDeleteDialog}
            onUpdate={handleSaveEdit}
          />

          {filteredAuthors.length === 0 && (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                {searchTerm
                  ? "Keine Urheber gefunden, die Ihren Suchkriterien entsprechen."
                  : "Keine Urheber vorhanden"}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Create Author Dialog */}
      <Dialog open={isCreatingAuthor} onOpenChange={setIsCreatingAuthor}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Neuen Urheber anlegen</DialogTitle>
            <DialogDescription>
              Erstelle einen neuen Urheber für deine Buchprojekte.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <AuthorForm
              onSubmit={handleCreateAuthor}
              onCancel={handleCancelCreateAuthor}
              isEmbedded={true}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Author Dialog */}
      <Dialog
        open={!!editingAuthor}
        onOpenChange={(open) => !open && handleCancelEdit()}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Urheber bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeite die Daten des Urhebers.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {editAuthorFormData && (
              <AuthorForm
                onSubmit={handleSaveEdit}
                initialData={editAuthorFormData}
                onCancel={handleCancelEdit}
                isEmbedded={false}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Urheber löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diesen Urheber löschen möchten? Diese
              Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAuthor}
              className="bg-red-600 hover:bg-red-700"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return content;
};

export default Authors;
