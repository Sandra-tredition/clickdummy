import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { TreeSelect } from "@/components/ui/treeselect";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckIcon,
  UsersIcon,
  BookOpenIcon,
  StarIcon,
  TagIcon,
  SaveIcon,
  XIcon,
  AlertCircleIcon,
  PlusIcon,
  PlusCircleIcon,
  TrashIcon,
  UserIcon,
  EditIcon,
  InfoIcon,
  ExternalLinkIcon,
  SearchIcon,
} from "lucide-react";
import AddAuthorDialog from "@/components/Project/dialogs/AddAuthorDialog";
import NewAuthorDialog from "@/components/Project/dialogs/NewAuthorDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DraggableAuthorList from "@/components/Project/DraggableAuthorList";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import { mockAuthors, getBiographiesForAuthor } from "@/lib/mockData/authors";
import { mockSeries } from "@/lib/mockData/series";
import { mockVerlagsmarken } from "@/lib/mockData/verlagsmarken";

interface ProjectDetailsProps {
  project: any;
  projectAuthors: any[];
  isEditing?: boolean;
  editedProject?: any;
  onInputChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSelectChange?: (name: string, value: any) => void;
  onSave?: () => void;
  onCancel?: () => void;
  seriesList?: any[];
  genreOptions?: any[];

  handleRemoveAuthorFromProject?: (authorId: string) => void;
  setIsAuthorDialogOpen?: (isOpen: boolean) => void;
  setIsNewAuthorDialogOpen?: (isOpen: boolean) => void;
  setIsNewSeriesDialogOpen?: (isOpen: boolean) => void;
  handleEditToggle?: () => void;

  authorBiographies?: any[];
  selectedAuthor?: string;
  selectedAuthorRole?: string;
  selectedBiography?: string;
  handleAuthorChange?: (authorId: string) => void;
  setSelectedAuthorRole?: (role: string) => void;
  setSelectedBiography?: (biographyId: string) => void;
  handleAddAuthorToProject?: () => void;
  handleAuthorCreated?: (authorData: any) => void;

  openAccordion?: string;
  setOpenAccordion?: (value: string) => void;
}

interface AuthorCardEditingState {
  isEditing: boolean;
  editedData: {
    series?: string;
    publisher?: string;
  };
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  projectAuthors,
  isEditing = false,
  editedProject,
  onInputChange,
  onSelectChange,
  onSave,
  onCancel,
  seriesList = [],
  genreOptions = [],

  handleRemoveAuthorFromProject,
  setIsAuthorDialogOpen,
  setIsNewAuthorDialogOpen,
  setIsNewSeriesDialogOpen,
  handleEditToggle,

  authorBiographies = [],
  selectedAuthor = "",
  selectedAuthorRole = "Autor",
  selectedBiography = "",
  handleAuthorChange,
  setSelectedAuthorRole,
  setSelectedBiography,
  handleAddAuthorToProject,
  handleAuthorCreated,

  openAccordion = "",
  setOpenAccordion,
}) => {
  const currentProject = isEditing ? editedProject : project;
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [modalEditedProject, setModalEditedProject] = React.useState(project);
  const [authorCardState, setAuthorCardState] =
    React.useState<AuthorCardEditingState>({
      isEditing: false,
      editedData: {
        series: project?.series || "",
        publisher: project?.publisher || "",
      },
    });

  // State for displaying selected data from localStorage
  const [selectedProjectData, setSelectedProjectData] = React.useState<{
    selectedSeries?: any;
    selectedPublisher?: any;
    selectedAuthors?: any[];
  }>({});

  const [isAuthorDialogOpen, setIsAuthorDialogOpenLocal] =
    React.useState(false);
  const [isNewAuthorDialogOpen, setIsNewAuthorDialogOpenLocal] =
    React.useState(false);
  const [localAuthors, setLocalAuthors] = React.useState(projectAuthors);
  const [isDragging, setIsDragging] = React.useState(false);

  // Selection dialogs state
  const [isSeriesSelectionOpen, setIsSeriesSelectionOpen] =
    React.useState(false);
  const [isPublisherSelectionOpen, setIsPublisherSelectionOpen] =
    React.useState(false);
  const [isAuthorSelectionOpen, setIsAuthorSelectionOpen] =
    React.useState(false);

  // Selection state
  const [selectedSeriesId, setSelectedSeriesId] = React.useState("");
  const [selectedPublisherId, setSelectedPublisherId] = React.useState("");
  const [selectedAuthorId, setSelectedAuthorId] = React.useState("");
  const [selectedBiographyId, setSelectedBiographyId] = React.useState("");
  const [selectedAuthorRoleLocal, setSelectedAuthorRoleLocal] =
    React.useState("Autor");

  // Get project language for biography filtering
  const projectLanguage = project?.languages?.[0] || "de"; // Default to German

  // Get available biographies for selected author, filtered by project language
  const availableBiographies = React.useMemo(() => {
    if (!selectedAuthorId) return [];
    const biographies = getBiographiesForAuthor(selectedAuthorId);
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
  }, [selectedAuthorId, projectLanguage]);

  // Update local authors when projectAuthors changes
  React.useEffect(() => {
    setLocalAuthors(projectAuthors);
  }, [projectAuthors]);

  // Track processed authors to prevent duplicates
  const [processedAuthorIds, setProcessedAuthorIds] = React.useState<
    Set<string>
  >(new Set());

  // Update local authors when selectedProjectData.selectedAuthors changes
  React.useEffect(() => {
    if (
      selectedProjectData.selectedAuthors &&
      selectedProjectData.selectedAuthors.length > 0
    ) {
      // Filter out already processed authors to prevent duplicates
      const newAuthors = selectedProjectData.selectedAuthors.filter(
        (selectedAuthor) => {
          const authorKey = `${selectedAuthor.author.id}-${selectedAuthor.role}`;
          return !processedAuthorIds.has(authorKey);
        },
      );

      if (newAuthors.length > 0) {
        // Convert selectedAuthors to the format expected by localAuthors
        const convertedAuthors = newAuthors.map((selectedAuthor, index) => ({
          id: `temp-${Date.now()}-${index}`,
          project_id: project.id,
          author_id: selectedAuthor.author.id,
          author_role: selectedAuthor.role,
          biography_id: selectedAuthor.biography?.id || null,
          display_order: localAuthors.length + index,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          authors: selectedAuthor.author,
          author_biographies: selectedAuthor.biography || null,
        }));

        // Add the converted authors to the existing localAuthors
        setLocalAuthors((prev) => [...prev, ...convertedAuthors]);

        // Mark these authors as processed
        const newProcessedIds = new Set(processedAuthorIds);
        newAuthors.forEach((selectedAuthor) => {
          const authorKey = `${selectedAuthor.author.id}-${selectedAuthor.role}`;
          newProcessedIds.add(authorKey);
        });
        setProcessedAuthorIds(newProcessedIds);
      }
    }
  }, [
    selectedProjectData.selectedAuthors,
    project.id,
    localAuthors.length,
    processedAuthorIds,
  ]);

  // Load selected data from localStorage on component mount
  React.useEffect(() => {
    const loadSelectedData = () => {
      try {
        const projectData = JSON.parse(
          localStorage.getItem(`project_${project.id}`) || "{}",
        );
        setSelectedProjectData({
          selectedSeries: projectData.selectedSeries,
          selectedPublisher: projectData.selectedPublisher,
          selectedAuthors: projectData.selectedAuthors || [],
        });
      } catch (error) {
        console.error("Error loading selected data from localStorage:", error);
      }
    };

    loadSelectedData();
  }, [project.id]);

  // Initialize allAuthors state with mockAuthors
  const [allAuthors, setAllAuthors] = React.useState(mockAuthors);

  const handleDragEnd = (result: any) => {
    setIsDragging(false);
    if (!result.destination) return;

    const items = Array.from(localAuthors);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display_order for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      display_order: index,
    }));

    setLocalAuthors(updatedItems);
    // Here you would typically save the new order to the backend
    console.log("New author order:", updatedItems);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleAuthorCardEdit = () => {
    setAuthorCardState({
      isEditing: true,
      editedData: {
        series: project?.series || "",
        publisher: project?.publisher || "",
      },
    });
  };

  const handleAuthorCardSave = () => {
    // Here you would typically save the data to the backend
    console.log("Saving author card data:", authorCardState.editedData);
    setAuthorCardState((prev) => ({ ...prev, isEditing: false }));
  };

  const handleAuthorCardCancel = () => {
    setAuthorCardState({
      isEditing: false,
      editedData: {
        series: project?.series || "",
        publisher: project?.publisher || "",
      },
    });
  };

  const handleAuthorCardInputChange = (field: string, value: string) => {
    setAuthorCardState((prev) => ({
      ...prev,
      editedData: {
        ...prev.editedData,
        [field]: value,
      },
    }));
  };

  // Selection handlers
  const handleSeriesSelection = () => {
    if (selectedSeriesId) {
      const selectedSeries = mockSeries.find((s) => s.id === selectedSeriesId);
      console.log("Selected series:", selectedSeries);

      // Store in localStorage
      const projectData = JSON.parse(
        localStorage.getItem(`project_${project.id}`) || "{}",
      );
      projectData.selectedSeries = selectedSeries;
      localStorage.setItem(
        `project_${project.id}`,
        JSON.stringify(projectData),
      );

      setIsSeriesSelectionOpen(false);
      setSelectedSeriesId("");

      // Update local state to reflect the change immediately
      setSelectedProjectData((prev) => ({
        ...prev,
        selectedSeries: selectedSeries,
      }));
    }
  };

  const handlePublisherSelection = () => {
    if (selectedPublisherId) {
      const selectedPublisher = mockVerlagsmarken.find(
        (p) => p.id === selectedPublisherId,
      );
      console.log("Selected publisher:", selectedPublisher);

      // Store in localStorage
      const projectData = JSON.parse(
        localStorage.getItem(`project_${project.id}`) || "{}",
      );
      projectData.selectedPublisher = selectedPublisher;
      localStorage.setItem(
        `project_${project.id}`,
        JSON.stringify(projectData),
      );

      setIsPublisherSelectionOpen(false);
      setSelectedPublisherId("");

      // Update local state to reflect the change immediately
      setSelectedProjectData((prev) => ({
        ...prev,
        selectedPublisher: selectedPublisher,
      }));
    }
  };

  const handleAuthorSelection = () => {
    console.log("handleAuthorSelection called with:", {
      selectedAuthorId,
      selectedAuthorRoleLocal,
      selectedBiographyId,
    });

    if (!selectedAuthorId) {
      console.log("No author selected");
      return false;
    }

    const selectedAuthor = mockAuthors.find((a) => a.id === selectedAuthorId);
    if (!selectedAuthor) {
      console.log("Selected author not found in mockAuthors");
      return false;
    }

    const selectedBiography = selectedBiographyId
      ? availableBiographies.find((b) => b.id === selectedBiographyId)
      : null;

    console.log(
      "Selected author:",
      selectedAuthor,
      "with biography:",
      selectedBiography,
      "and role:",
      selectedAuthorRoleLocal,
    );

    // Check if this author with this role already exists
    const existingAuthor = localAuthors.find(
      (author) =>
        author.author_id === selectedAuthorId &&
        author.author_role === selectedAuthorRoleLocal,
    );

    if (existingAuthor) {
      console.log("Author with this role already exists in project");
      alert(
        "Dieser Urheber ist bereits mit dieser Rolle im Projekt zugeordnet.",
      );
      return false;
    }

    // Create new project author entry in the format expected by the parent component
    const newProjectAuthor = {
      id: `pa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      project_id: project.id,
      author_id: selectedAuthorId,
      author_role: selectedAuthorRoleLocal,
      biography_id: selectedBiographyId || null,
      display_order: localAuthors.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      authors: selectedAuthor,
      author_biographies: selectedBiography || null,
    };

    console.log("Adding new project author:", newProjectAuthor);

    // Add to local authors immediately for UI update
    setLocalAuthors((prev) => {
      const updated = [...prev, newProjectAuthor];
      console.log("Updated localAuthors:", updated);
      return updated;
    });

    // Mark this author as processed to prevent duplicates
    const authorKey = `${selectedAuthorId}-${selectedAuthorRoleLocal}`;
    setProcessedAuthorIds((prev) => new Set([...prev, authorKey]));

    console.log("Author successfully added to project:", newProjectAuthor);

    // Reset state but don't close dialog here - let onConfirm handle it
    setSelectedAuthorId("");
    setSelectedBiographyId("");
    setSelectedAuthorRoleLocal("Autor");

    return true; // Indicate success
  };

  // Reset biography selection when author changes
  React.useEffect(() => {
    setSelectedBiographyId("");
  }, [selectedAuthorId]);

  // Modal handlers
  const handleModalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setModalEditedProject((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModalSelectChange = (name: string, value: any) => {
    setModalEditedProject((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModalSave = () => {
    // Here you would typically save the data to the backend
    console.log("Saving modal project data:", modalEditedProject);
    onSave?.();
    setIsEditModalOpen(false);
  };

  const handleModalCancel = () => {
    setModalEditedProject(project);
    setIsEditModalOpen(false);
  };

  const handleOpenEditModal = () => {
    setModalEditedProject(project);
    setIsEditModalOpen(true);
  };

  const handleLocalAuthorCreated = (authorData: any, role?: string) => {
    console.log("New author created:", authorData, "with role:", role);

    // Check if this author with this role already exists to prevent duplicates
    const authorRole = role || "Autor";
    const existingAuthor = localAuthors.find(
      (author) =>
        author.author_id === authorData.author.id &&
        author.author_role === authorRole,
    );

    if (existingAuthor) {
      console.log(
        "Author with this role already exists, skipping duplicate creation",
      );
      return;
    }

    // Add the new author to the allAuthors list
    setAllAuthors((prev) => {
      // Check if author already exists in allAuthors to prevent duplicates
      const authorExists = prev.some(
        (author) => author.id === authorData.author.id,
      );
      if (authorExists) {
        return prev;
      }
      return [...prev, authorData.author];
    });

    // Automatically add the new author to the project with the selected role
    const newProjectAuthor = {
      id: `pa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      project_id: project.id,
      author_id: authorData.author.id,
      author_role: authorRole,
      biography_id: authorData.biographies?.[0]?.id || null,
      display_order: localAuthors.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      authors: authorData.author,
      author_biographies: authorData.biographies?.[0] || null,
    };

    setLocalAuthors((prev) => [...prev, newProjectAuthor]);

    // Mark this author as processed to prevent duplicates from localStorage
    const authorKey = `${authorData.author.id}-${authorRole}`;
    setProcessedAuthorIds((prev) => new Set([...prev, authorKey]));

    console.log(
      "Author successfully created and added to project:",
      newProjectAuthor,
    );
  };

  return (
    <>
      {/* Project Details Card */}

      <Card className="shadow-sm rounded-xl border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex justify-between items-center text-xl font-bold text-gray-900">
            <div className="flex items-center">
              <StarIcon className="h-6 w-6 mr-3 text-blue-600" />
              Über dieses Buch
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleOpenEditModal} size="sm">
                <EditIcon className="h-4 w-4 mr-2" />
                Bearbeiten
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="prose max-w-none">
            <p className="text-gray-700">
              {project.description || (
                <span className="text-muted-foreground italic">
                  Keine Beschreibung vorhanden
                </span>
              )}
            </p>
          </div>

          {/* Marketing Data */}
          <>
            {project.slogan && (
              <div className="mt-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 mb-8">
                  <p className="text-xl font-semibold text-center italic text-gray-800">
                    "{project.slogan}"
                  </p>
                </div>
              </div>
            )}

            {project.target_audience && (
              <div className="mt-8">
                <h4 className="font-semibold text-base text-gray-800 mb-4 flex items-center">
                  Für wen eignet sich dieses Buch
                </h4>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <p className="text-gray-700 leading-relaxed">
                    {project.target_audience}
                  </p>

                  {Array.isArray(project.target_audience_groups) &&
                    project.target_audience_groups.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.target_audience_groups.map(
                          (group: string, index: number) => (
                            <Badge
                              key={index}
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 px-3 py-1"
                            >
                              {group}
                            </Badge>
                          ),
                        )}
                      </div>
                    )}
                </div>
              </div>
            )}

            {project.selling_points && (
              <div className="mt-8">
                <h4 className="font-semibold text-base text-gray-800 mb-4 flex items-center">
                  Highlights
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(project.selling_points || "")
                    .split(",")
                    .map((point: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{point.trim()}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Keywords Section */}
            {project.keywords && (
              <div className="mt-8">
                <h4 className="font-semibold text-base text-gray-800 mb-4 flex items-center">
                  Suchbegriffe
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.keywords
                    .split(",")
                    .map((keyword: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 px-3 py-1"
                      >
                        {keyword.trim()}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vermarktungsdaten bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeite die Vermarktungsdaten für dein Buchprojekt.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="modal-description">Beschreibung</Label>
              <Textarea
                id="modal-description"
                name="description"
                value={modalEditedProject?.description || ""}
                onChange={handleModalInputChange}
                rows={4}
              />
            </div>

            {/* Slogan */}
            <div className="space-y-2">
              <Label htmlFor="modal-slogan">Slogan</Label>
              <Input
                id="modal-slogan"
                name="slogan"
                value={modalEditedProject?.slogan || ""}
                onChange={handleModalInputChange}
                placeholder="Kurzer, prägnanter Slogan"
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <Label htmlFor="modal-targetAudience">Zielgruppe</Label>
              <Textarea
                id="modal-targetAudience"
                name="targetAudience"
                value={modalEditedProject?.targetAudience || ""}
                onChange={handleModalInputChange}
                placeholder="Beschreibe deine Zielgruppe"
                rows={2}
              />
            </div>

            {/* Target Audience Groups */}
            <div className="space-y-2">
              <Label htmlFor="modal-targetAudienceGroups">
                Zielgruppen-Klassifikation
              </Label>
              <MultiSelect
                options={[
                  { value: "Kinder", label: "Kinder" },
                  { value: "Jugendliche", label: "Jugendliche" },
                  { value: "Junge Erwachsene", label: "Junge Erwachsene" },
                  { value: "Erwachsene", label: "Erwachsene" },
                  { value: "Senioren", label: "Senioren" },
                  { value: "Frauen", label: "Frauen" },
                  { value: "Männer", label: "Männer" },
                  { value: "Akademiker", label: "Akademiker" },
                  { value: "Fachpublikum", label: "Fachpublikum" },
                  { value: "Hobbyisten", label: "Hobbyisten" },
                  { value: "Anfänger", label: "Anfänger" },
                  { value: "Fortgeschrittene", label: "Fortgeschrittene" },
                  { value: "Experten", label: "Experten" },
                ]}
                selected={
                  Array.isArray(modalEditedProject?.targetAudienceGroups)
                    ? modalEditedProject.targetAudienceGroups
                    : []
                }
                onChange={(values) =>
                  handleModalSelectChange("targetAudienceGroups", values)
                }
                placeholder="Zielgruppen auswählen"
              />
            </div>

            {/* Selling Points */}
            <div className="space-y-2">
              <Label htmlFor="modal-sellingPoints">Kaufargumente</Label>
              <Textarea
                id="modal-sellingPoints"
                name="sellingPoints"
                value={modalEditedProject?.sellingPoints || ""}
                onChange={handleModalInputChange}
                placeholder="Stichpunktartige Kaufargumente (z.B. 'Praxisnah, Leicht verständlich, Umfassend')"
                rows={2}
              />
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label htmlFor="modal-keywords">Suchbegriffe</Label>
              <Textarea
                id="modal-keywords"
                name="keywords"
                value={modalEditedProject?.keywords || ""}
                onChange={handleModalInputChange}
                placeholder="Suchbegriffe, durch Kommas getrennt"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleModalCancel}>
              <XIcon className="h-4 w-4 mr-2" />
              Abbrechen
            </Button>
            <Button onClick={handleModalSave}>
              <SaveIcon className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Author, Series, and Publisher Information Card */}
      <Card className="mb-6 mt-8 shadow-sm rounded-xl border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-xl font-bold text-gray-900">
            <div className="flex items-center">
              <UsersIcon className="h-6 w-6 mr-3 text-blue-600" />
              Urheber & Verlagsdaten
            </div>
            <div className="flex gap-2">
              {authorCardState.isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleAuthorCardCancel}
                    size="sm"
                  >
                    <XIcon className="h-4 w-4 mr-2" />
                    Abbrechen
                  </Button>
                  <Button onClick={handleAuthorCardSave} size="sm">
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Speichern
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleAuthorCardEdit}
                  size="sm"
                >
                  <EditIcon className="h-4 w-4 mr-2" />
                  Bearbeiten
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Central Management Notice - Only shown in editing mode */}
          {authorCardState.isEditing && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h5 className="font-medium text-blue-900 mb-2">
                    Zentral verwaltete Daten
                  </h5>
                  <p className="text-sm text-blue-800 mb-3">
                    Diese Daten werden zentral verwaltet und können in mehreren
                    Projekten verwendet werden. Änderungen wirken sich auf alle
                    zugeordneten Projekte aus. Die Bearbeitung bestehender Daten
                    nimmst du daher in diesen Bereichen vor:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to="/buchmanagement?tab=authors"
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900 underline decoration-2 hover:decoration-4 transition-all"
                    >
                      Urheber verwalten
                      <ExternalLinkIcon className="h-3 w-3" />
                    </Link>
                    <Link
                      to="/buchmanagement?tab=series"
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900 underline decoration-2 hover:decoration-4 transition-all"
                    >
                      Buchreihen verwalten
                      <ExternalLinkIcon className="h-3 w-3" />
                    </Link>
                    <Link
                      to="/buchmanagement?tab=verlagsmarken"
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900 underline decoration-2 hover:decoration-4 transition-all"
                    >
                      Verlagsmarken verwalten
                      <ExternalLinkIcon className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Authors */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-base text-gray-800">
                  Urheber
                </h4>
                {authorCardState.isEditing && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAuthorSelectionOpen(true)}
                    >
                      <SearchIcon className="h-4 w-4 mr-1" />
                      Urheber auswählen
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsNewAuthorDialogOpenLocal(true)}
                    >
                      <PlusCircleIcon className="h-4 w-4 mr-1" />
                      Neu anlegen
                    </Button>
                  </div>
                )}
              </div>
              {localAuthors && localAuthors.length > 0 ? (
                authorCardState.isEditing ? (
                  <DraggableAuthorList
                    authors={localAuthors}
                    onOrderChange={(reorderedAuthors) => {
                      setLocalAuthors(reorderedAuthors);
                      console.log("New author order:", reorderedAuthors);
                    }}
                    onRemove={(authorId) => {
                      if (authorCardState.isEditing) {
                        handleRemoveAuthorFromProject?.(authorId);
                      }
                    }}
                  />
                ) : (
                  <div className="space-y-3">
                    {localAuthors.map((author) => (
                      <div
                        key={author.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {author.authors.author_type === "person"
                                ? `${author.authors.first_name} ${author.authors.last_name}`
                                : author.authors.company_name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {author.author_role || "Autor"}
                            </Badge>
                            <a
                              href={`/buchmanagement#authors&authorId=${author.authors.id}`}
                              className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 underline decoration-2 hover:decoration-4 transition-all"
                            >
                              Bearbeiten
                            </a>
                          </div>
                          {author.author_biographies?.biography_text &&
                          author.author_biographies.biography_text !==
                            "Keine Biografie vorhanden." ? (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {author.author_biographies.biography_text}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic mt-1">
                              Keine Biografie zugeordnet
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="space-y-2">
                  {/* Show message only if no authors at all */}
                  {(!selectedProjectData.selectedAuthors ||
                    selectedProjectData.selectedAuthors.length === 0) && (
                    <p className="text-sm text-gray-400 italic">
                      Keine Urheber zugewiesen
                    </p>
                  )}

                  {/* Display newly selected authors */}
                  {selectedProjectData.selectedAuthors &&
                    selectedProjectData.selectedAuthors.length > 0 && (
                      <div className="space-y-3">
                        {selectedProjectData.selectedAuthors.map(
                          (selectedAuthor, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900">
                                    {selectedAuthor.author.author_type ===
                                    "person"
                                      ? `${selectedAuthor.author.first_name} ${selectedAuthor.author.last_name}`
                                      : selectedAuthor.author.company_name}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {selectedAuthor.role || "Autor"}
                                  </Badge>
                                  <a
                                    href={`/buchmanagement#authors&authorId=${selectedAuthor.author.id}`}
                                    className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 underline decoration-2 hover:decoration-4 transition-all"
                                  >
                                    Bearbeiten
                                  </a>
                                </div>
                                {selectedAuthor.biography &&
                                selectedAuthor.biography.biography_text ? (
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                      {selectedAuthor.biography.biography_text}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 italic mt-1">
                                    Keine Biografie zugeordnet
                                  </p>
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Series */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-base text-gray-800">
                  Buchreihe (optional)
                </h4>
                {authorCardState.isEditing && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSeriesSelectionOpen(true)}
                    >
                      <SearchIcon className="h-4 w-4 mr-1" />
                      Buchreihe auswählen
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log("Create new series")}
                    >
                      <PlusCircleIcon className="h-4 w-4 mr-1" />
                      Neu anlegen
                    </Button>
                  </div>
                )}
              </div>
              {selectedProjectData.selectedSeries ? (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {selectedProjectData.selectedSeries.name}
                      </span>
                    </div>
                    {selectedProjectData.selectedSeries.description && (
                      <p className="text-sm text-gray-600 leading-relaxed mt-1">
                        {selectedProjectData.selectedSeries.description}
                      </p>
                    )}
                  </div>
                </div>
              ) : project.series ? (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">
                      {project.series}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Keine Buchreihe zugewiesen
                </p>
              )}
            </div>

            {/* Publisher */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-base text-gray-800">
                  Verlagsmarke (optional)
                </h4>
                {authorCardState.isEditing && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPublisherSelectionOpen(true)}
                    >
                      <SearchIcon className="h-4 w-4 mr-1" />
                      Verlagsmarke auswählen
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log("Create new publisher")}
                    >
                      <PlusCircleIcon className="h-4 w-4 mr-1" />
                      Neu anlegen
                    </Button>
                  </div>
                )}
              </div>
              {selectedProjectData.selectedPublisher ? (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {selectedProjectData.selectedPublisher.name}
                      </span>
                    </div>
                    {selectedProjectData.selectedPublisher.description && (
                      <p className="text-sm text-gray-600 leading-relaxed mt-1">
                        {selectedProjectData.selectedPublisher.description}
                      </p>
                    )}
                  </div>
                </div>
              ) : project.publisher ? (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">
                      {project.publisher}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Keine Verlagsmarke zugewiesen
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Author Dialogs */}
      <AddAuthorDialog
        isOpen={isAuthorDialogOpen}
        onOpenChange={setIsAuthorDialogOpenLocal}
        authors={allAuthors}
        selectedAuthor={selectedAuthor}
        selectedAuthorRole={selectedAuthorRole}
        selectedBiography={selectedBiography}
        authorBiographies={authorBiographies}
        handleAuthorChange={handleAuthorChange || (() => {})}
        setSelectedAuthorRole={setSelectedAuthorRole || (() => {})}
        setSelectedBiography={setSelectedBiography || (() => {})}
        handleAddAuthorToProject={handleAddAuthorToProject || (() => {})}
        projectLanguages={project?.languages || []}
        existingProjectAuthors={localAuthors}
      />

      <NewAuthorDialog
        isOpen={isNewAuthorDialogOpen}
        onOpenChange={setIsNewAuthorDialogOpenLocal}
        onAuthorCreatedWithRole={handleLocalAuthorCreated}
        showRoleSelection={true}
      />

      {/* Series Selection Dialog */}
      <Dialog
        open={isSeriesSelectionOpen}
        onOpenChange={setIsSeriesSelectionOpen}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buchreihe auswählen</DialogTitle>
            <DialogDescription>
              Wähle eine bestehende Buchreihe aus der Liste aus.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="series-select">Buchreihe</Label>
              <Select
                value={selectedSeriesId}
                onValueChange={setSelectedSeriesId}
              >
                <SelectTrigger id="series-select">
                  <SelectValue placeholder="Buchreihe auswählen" />
                </SelectTrigger>
                <SelectContent
                  className="max-h-[200px] overflow-y-auto"
                  position="popper"
                  sideOffset={5}
                >
                  {mockSeries.map((series) => (
                    <SelectItem key={series.id} value={series.id}>
                      <span className="font-medium">{series.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsSeriesSelectionOpen(false);
                setSelectedSeriesId("");
              }}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleSeriesSelection}
              disabled={!selectedSeriesId}
            >
              Auswählen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publisher Selection Dialog */}
      <Dialog
        open={isPublisherSelectionOpen}
        onOpenChange={setIsPublisherSelectionOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verlagsmarke auswählen</DialogTitle>
            <DialogDescription>
              Wähle eine bestehende Verlagsmarke aus der Liste aus.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="publisher-select">Verlagsmarke</Label>
              <Select
                value={selectedPublisherId}
                onValueChange={setSelectedPublisherId}
              >
                <SelectTrigger id="publisher-select">
                  <SelectValue placeholder="Verlagsmarke auswählen" />
                </SelectTrigger>
                <SelectContent
                  className="max-h-[200px] overflow-y-auto"
                  position="popper"
                  sideOffset={5}
                >
                  {mockVerlagsmarken.map((publisher) => (
                    <SelectItem key={publisher.id} value={publisher.id}>
                      <span className="font-medium">{publisher.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Display selected publisher */}
              {selectedPublisherId && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <h5 className="font-medium text-sm text-gray-900 mb-2">
                    Ausgewählte Verlagsmarke:
                  </h5>
                  <div className="text-left">
                    <p className="font-medium text-sm mb-1">
                      {
                        mockVerlagsmarken.find(
                          (p) => p.id === selectedPublisherId,
                        )?.name
                      }
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {
                        mockVerlagsmarken.find(
                          (p) => p.id === selectedPublisherId,
                        )?.description
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPublisherSelectionOpen(false);
                setSelectedPublisherId("");
              }}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handlePublisherSelection}
              disabled={!selectedPublisherId}
            >
              Auswählen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Author Selection Dialog - Using unified AddAuthorDialog */}
      <AddAuthorDialog
        isOpen={isAuthorSelectionOpen}
        onOpenChange={setIsAuthorSelectionOpen}
        authors={mockAuthors}
        title="Urheber auswählen"
        description="Wähle einen bestehenden Urheber und eine passende Biografie aus."
        buttonText="Hinzufügen"
        standalone={true}
        projectLanguages={project?.languages || ["de"]}
        selectedAuthor={selectedAuthorId}
        selectedAuthorRole={selectedAuthorRoleLocal}
        selectedBiography={selectedBiographyId}
        handleAuthorChange={setSelectedAuthorId}
        setSelectedAuthorRole={setSelectedAuthorRoleLocal}
        setSelectedBiography={setSelectedBiographyId}
        onConfirm={() => {
          const success = handleAuthorSelection();
          if (success) {
            setIsAuthorSelectionOpen(false);
          }
        }}
        existingProjectAuthors={localAuthors}
      />
    </>
  );
};

export default ProjectDetails;
