import React from "react";
import { Badge } from "@/components/ui/badge";
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
  SearchIcon,
  PlusCircleIcon,
  InfoIcon,
  ExternalLinkIcon,
  UsersIcon,
  EditIcon,
  UserPlusIcon,
  BookOpenIcon,
  CheckIcon,
  XIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  Trash2Icon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DraggableAuthorList from "@/components/Project/DraggableAuthorList";
import AddAuthorDialog from "@/components/Project/dialogs/AddAuthorDialog";
import NewAuthorDialog from "@/components/Project/dialogs/NewAuthorDialog";
import EntityCreationModal from "@/components/Project/dialogs/EntityCreationModal";
import AuthorBasicDataForm, {
  BasicAuthorFormValues,
} from "@/components/Authors/AuthorBasicDataForm";
import { Link, useNavigate } from "react-router-dom";
import {
  mockAuthors,
  getBiographiesForAuthor,
  getStandardBiographyForAuthor,
} from "@/lib/mockData/authors";

// Check if current user is the clean user (no mock data)
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
};

const isCleanUser = () => {
  const currentUser = getCurrentUser();
  return currentUser?.email === "clean@example.com";
};
import { mockSeries } from "@/lib/mockData/series";
import { mockVerlagsmarken } from "@/lib/mockData/verlagsmarken";

interface AuthorPublisherSectionProps {
  project: any;
  projectAuthors: any[];
  onAuthorOrderChange?: (reorderedAuthors: any[]) => void;
  onRemoveAuthor?: (authorId: string) => void;
}

const AuthorPublisherSection: React.FC<AuthorPublisherSectionProps> = ({
  project,
  projectAuthors,
  onAuthorOrderChange,
  onRemoveAuthor,
}) => {
  const [localAuthors, setLocalAuthors] = React.useState(projectAuthors);
  const [processedAuthorIds, setProcessedAuthorIds] = React.useState<
    Set<string>
  >(new Set());

  // State for displaying selected data from localStorage
  const [selectedProjectData, setSelectedProjectData] = React.useState<{
    selectedSeries?: any;
    selectedPublisher?: any;
    selectedAuthors?: any[];
  }>({});

  // Dialog states
  const [isAuthorDialogOpen, setIsAuthorDialogOpen] = React.useState(false);
  const [isNewAuthorDialogOpen, setIsNewAuthorDialogOpen] =
    React.useState(false);
  const [isSeriesSelectionOpen, setIsSeriesSelectionOpen] =
    React.useState(false);
  const [isPublisherSelectionOpen, setIsPublisherSelectionOpen] =
    React.useState(false);
  const [isAuthorSelectionOpen, setIsAuthorSelectionOpen] =
    React.useState(false);

  // Series Management Modal states
  const [isSeriesManagementOpen, setIsSeriesManagementOpen] =
    React.useState(false);
  const [seriesManagementStep, setSeriesManagementStep] = React.useState<
    "selection" | "form"
  >("selection");
  const [seriesCreationMode, setSeriesCreationMode] = React.useState<
    "existing" | "new" | null
  >(null);
  const [newSeriesFormData, setNewSeriesFormData] = React.useState<any>(null);

  // Publisher Management Modal states
  const [isPublisherManagementOpen, setIsPublisherManagementOpen] =
    React.useState(false);
  const [publisherManagementStep, setPublisherManagementStep] = React.useState<
    "selection" | "form"
  >("selection");
  const [publisherCreationMode, setPublisherCreationMode] = React.useState<
    "existing" | "new" | null
  >(null);
  const [newPublisherFormData, setNewPublisherFormData] =
    React.useState<any>(null);

  // Author Management Slideout states
  const [isAuthorManagementOpen, setIsAuthorManagementOpen] =
    React.useState(false);
  const [authorManagementStep, setAuthorManagementStep] = React.useState<
    "selection" | "author-form" | "biography"
  >("selection");
  const [selectedAuthorForBio, setSelectedAuthorForBio] =
    React.useState<any>(null);
  const [biographyChoice, setBiographyChoice] = React.useState<
    "new" | "existing" | "none" | null
  >(null);
  const [newBiographyText, setNewBiographyText] = React.useState("");
  const [selectedExistingBiography, setSelectedExistingBiography] =
    React.useState("");
  const [authorCreationMode, setAuthorCreationMode] = React.useState<
    "existing" | "new" | null
  >(null);
  const [newAuthorFormData, setNewAuthorFormData] = React.useState<any>(null);

  // Project-specific biography editing states
  const [editingProjectBiography, setEditingProjectBiography] = React.useState<{
    authorId: string;
    projectAuthorId: string;
    currentText: string;
  } | null>(null);
  const [projectBiographyText, setProjectBiographyText] = React.useState("");

  const navigate = useNavigate();

  // Selection state
  const [selectedSeriesId, setSelectedSeriesId] = React.useState("");
  const [selectedPublisherId, setSelectedPublisherId] = React.useState("");
  const [selectedAuthorId, setSelectedAuthorId] = React.useState("");
  const [selectedBiographyId, setSelectedBiographyId] = React.useState("");
  const [selectedAuthorRoleLocal, setSelectedAuthorRoleLocal] =
    React.useState("Autor");

  // Get project language for biography filtering
  const projectLanguage = project?.languages?.[0] || "de";

  // Get available biographies for selected author, filtered by project language
  const availableBiographies = React.useMemo(() => {
    if (!selectedAuthorId) return [];
    const biographies = getBiographiesForAuthor(selectedAuthorId);
    return biographies.filter((bio) => {
      const bioLang = bio.language?.toLowerCase();
      const projLang = projectLanguage?.toLowerCase();

      if (bioLang === projLang) return true;

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

      if (languageMapping[projLang] === bioLang) return true;
      if (languageMapping[bioLang] === projLang) return true;

      return false;
    });
  }, [selectedAuthorId, projectLanguage]);

  // Update local authors when projectAuthors changes
  React.useEffect(() => {
    setLocalAuthors(projectAuthors);
  }, [projectAuthors]);

  // Update local authors when selectedProjectData.selectedAuthors changes
  React.useEffect(() => {
    if (
      selectedProjectData.selectedAuthors &&
      selectedProjectData.selectedAuthors.length > 0
    ) {
      const newAuthors = selectedProjectData.selectedAuthors.filter(
        (selectedAuthor) => {
          const authorKey = `${selectedAuthor.author.id}-${selectedAuthor.role}`;
          return !processedAuthorIds.has(authorKey);
        },
      );

      if (newAuthors.length > 0) {
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

        setLocalAuthors((prev) => [...prev, ...convertedAuthors]);

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

  // Selection handlers
  const handleSeriesSelection = () => {
    if (selectedSeriesId) {
      const selectedSeries = mockSeries.find((s) => s.id === selectedSeriesId);
      console.log("Selected series:", selectedSeries);

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

    setLocalAuthors((prev) => {
      const updated = [...prev, newProjectAuthor];
      console.log("Updated localAuthors:", updated);
      return updated;
    });

    const authorKey = `${selectedAuthorId}-${selectedAuthorRoleLocal}`;
    setProcessedAuthorIds((prev) => new Set([...prev, authorKey]));

    console.log("Author successfully added to project:", newProjectAuthor);

    setSelectedAuthorId("");
    setSelectedBiographyId("");
    setSelectedAuthorRoleLocal("Autor");

    return true;
  };

  // Reset biography selection when author changes
  React.useEffect(() => {
    setSelectedBiographyId("");
  }, [selectedAuthorId]);

  // Get all roles with information about which are already assigned
  const rolesWithStatus = React.useMemo(() => {
    const allRoles = [
      "Autor",
      "Co-Autor",
      "Herausgeber",
      "Übersetzer",
      "Illustrator",
      "Lektor",
    ];

    if (!selectedAuthorId) {
      return allRoles.map((role) => ({ role, isAssigned: false }));
    }

    // Find existing roles for this author in the project
    const existingRoles = localAuthors
      .filter((author) => author.author_id === selectedAuthorId)
      .map((author) => author.author_role);

    // Return all roles with assignment status
    return allRoles.map((role) => ({
      role,
      isAssigned: existingRoles.includes(role),
    }));
  }, [selectedAuthorId, localAuthors]);

  // Get available roles for selected author (exclude roles that already exist) - for backward compatibility
  const availableRoles = React.useMemo(() => {
    return rolesWithStatus
      .filter(({ isAssigned }) => !isAssigned)
      .map(({ role }) => role);
  }, [rolesWithStatus]);

  // Reset role selection when author changes and current role is not available
  React.useEffect(() => {
    if (selectedAuthorId && !availableRoles.includes(selectedAuthorRoleLocal)) {
      setSelectedAuthorRoleLocal(availableRoles[0] || "Autor");
    }
  }, [selectedAuthorId, availableRoles, selectedAuthorRoleLocal]);

  const handleLocalAuthorCreated = (authorData: any, role?: string) => {
    console.log("New author created:", authorData, "with role:", role);

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

    const authorKey = `${authorData.author.id}-${authorRole}`;
    setProcessedAuthorIds((prev) => new Set([...prev, authorKey]));

    console.log(
      "Author successfully created and added to project:",
      newProjectAuthor,
    );
  };

  const handleAuthorOrderChange = (reorderedAuthors: any[]) => {
    setLocalAuthors(reorderedAuthors);
    onAuthorOrderChange?.(reorderedAuthors);
  };

  const handleRemoveAuthor = (authorId: string) => {
    // Find the author being removed to get their details
    const removedAuthor = localAuthors.find((author) => author.id === authorId);

    // Update local authors state
    setLocalAuthors((prev) => prev.filter((author) => author.id !== authorId));

    // Also remove from selectedProjectData.selectedAuthors if it exists there
    if (removedAuthor) {
      setSelectedProjectData((prev) => {
        const updatedSelectedAuthors = (prev.selectedAuthors || []).filter(
          (selectedAuthor) =>
            !(
              selectedAuthor.author.id === removedAuthor.author_id &&
              selectedAuthor.role === removedAuthor.author_role
            ),
        );

        // Update localStorage as well
        const projectData = JSON.parse(
          localStorage.getItem(`project_${project.id}`) || "{}",
        );
        projectData.selectedAuthors = updatedSelectedAuthors;
        localStorage.setItem(
          `project_${project.id}`,
          JSON.stringify(projectData),
        );

        return {
          ...prev,
          selectedAuthors: updatedSelectedAuthors,
        };
      });

      // Remove from processed author IDs
      const authorKey = `${removedAuthor.author_id}-${removedAuthor.author_role}`;
      setProcessedAuthorIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(authorKey);
        return newSet;
      });
    }

    onRemoveAuthor?.(authorId);
  };

  // Author Management Slideout handlers
  const handleOpenAuthorManagement = () => {
    setIsAuthorManagementOpen(true);
    setAuthorManagementStep("selection");
    setAuthorCreationMode(null);
    setBiographyChoice(null);
    setNewBiographyText("");
    setSelectedExistingBiography("");
    setSelectedAuthorForBio(null);
    setSelectedAuthorId("");
    setSelectedAuthorRoleLocal("Autor");
  };

  const handleCloseAuthorManagement = () => {
    setIsAuthorManagementOpen(false);
    setAuthorManagementStep("selection");
    setAuthorCreationMode(null);
    setBiographyChoice(null);
    setNewBiographyText("");
    setSelectedExistingBiography("");
    setSelectedAuthorForBio(null);
    setSelectedAuthorId("");
    setSelectedAuthorRoleLocal("Autor");
    setNewAuthorFormData(null);
  };

  const handleAuthorModeSelection = (mode: "existing" | "new") => {
    // Check if user has no authors and trying to select existing
    if (mode === "existing" && isCleanUser()) {
      return; // Don't allow selection if no authors available
    }

    setAuthorCreationMode(mode);
    if (mode === "existing") {
      setAuthorManagementStep("author-form");
    } else {
      // Initialize form data for new author
      setNewAuthorFormData({
        authorType: "person",
        firstName: "",
        lastName: "",
        companyName: "",
        isPseudonym: false,
        birthDate: null,
        deathDate: null,
        isni: "",
        profession: "",
        company: "",
        website: "",
        additionalInfo: "",
      });
      setAuthorManagementStep("author-form");
    }
  };

  const handleAuthorSelected = (author: any) => {
    setSelectedAuthorForBio(author);
    setAuthorManagementStep("biography");
  };

  const handleAuthorCreated = (authorData: any) => {
    setSelectedAuthorForBio(authorData.author);
    setAuthorManagementStep("biography");
  };

  const handleNewAuthorFormSave = (data: BasicAuthorFormValues) => {
    // Create a new author object from the form data
    const newAuthor = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

    console.log("New author created from form:", newAuthor);
    handleAuthorCreated({ author: newAuthor });
  };

  const handleNewAuthorFormCancel = () => {
    setAuthorManagementStep("selection");
    setNewAuthorFormData(null);
  };

  const handleBiographyComplete = () => {
    if (!selectedAuthorForBio) return;

    // Check if author with this role already exists
    const existingAuthor = localAuthors.find(
      (author) =>
        author.author_id === selectedAuthorForBio.id &&
        author.author_role === selectedAuthorRoleLocal,
    );

    if (existingAuthor) {
      alert(
        "Dieser Urheber ist bereits mit dieser Rolle im Projekt zugeordnet.",
      );
      return;
    }

    let biographyData = null;
    if (biographyChoice === "new" && newBiographyText.trim()) {
      biographyData = {
        id: `temp-bio-${Date.now()}`,
        author_id: selectedAuthorForBio.id,
        biography_text: newBiographyText.trim(),
        biography_label: "Projektbezogen",
        language: project?.languages?.[0] || "Deutsch",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else if (
      biographyChoice === "existing" &&
      slideoutAvailableBiographies.length > 0
    ) {
      biographyData = slideoutAvailableBiographies[0];
    }

    // Add author to project
    const newProjectAuthor = {
      id: `pa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      project_id: project.id,
      author_id: selectedAuthorForBio.id,
      author_role: selectedAuthorRoleLocal,
      biography_id: biographyData?.id || null,
      display_order: localAuthors.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      authors: selectedAuthorForBio,
      author_biographies: biographyData || null,
    };

    setLocalAuthors((prev) => [...prev, newProjectAuthor]);

    const authorKey = `${selectedAuthorForBio.id}-${selectedAuthorRoleLocal}`;
    setProcessedAuthorIds((prev) => new Set([...prev, authorKey]));

    console.log("Author successfully added to project:", newProjectAuthor);
    handleCloseAuthorManagement();
  };

  // Get available biographies for selected author in slideout
  const slideoutAvailableBiographies = React.useMemo(() => {
    if (!selectedAuthorForBio) return [];
    const biographies = getBiographiesForAuthor(selectedAuthorForBio.id);
    return biographies.filter((bio) => {
      const bioLang = bio.language?.toLowerCase();
      const projLang = projectLanguage?.toLowerCase();

      if (bioLang === projLang) return true;

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

      if (languageMapping[projLang] === bioLang) return true;
      if (languageMapping[bioLang] === projLang) return true;

      return false;
    });
  }, [selectedAuthorForBio, projectLanguage]);

  // Handler for editing basic author data - redirects to author detail page
  const handleEditAuthorBasicData = (authorId: string) => {
    // Store navigation context for return
    localStorage.setItem(
      "authorPageNavigation",
      JSON.stringify({
        from: `/project/${project.id}`,
        timestamp: Date.now(),
      }),
    );
    navigate(`/authors/${authorId}?from=project-${project.id}`);
  };

  // Handler for editing project-specific biography
  const handleEditProjectBiography = (projectAuthor: any) => {
    const currentBiographyText =
      projectAuthor.author_biographies?.biography_text || "";
    setEditingProjectBiography({
      authorId: projectAuthor.author_id,
      projectAuthorId: projectAuthor.id,
      currentText: currentBiographyText,
    });
    setProjectBiographyText(currentBiographyText);
  };

  // Handler for saving project-specific biography
  const handleSaveProjectBiography = () => {
    if (!editingProjectBiography) return;

    // Update the local authors state with the new biography
    setLocalAuthors((prev) =>
      prev.map((author) => {
        if (author.id === editingProjectBiography.projectAuthorId) {
          return {
            ...author,
            author_biographies: {
              id: author.author_biographies?.id || `temp-bio-${Date.now()}`,
              author_id: editingProjectBiography.authorId,
              biography_text: projectBiographyText.trim(),
              biography_label: "Projektbezogen",
              language: project?.languages?.[0] || "Deutsch",
              created_at:
                author.author_biographies?.created_at ||
                new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          };
        }
        return author;
      }),
    );

    // Close the editing dialog
    setEditingProjectBiography(null);
    setProjectBiographyText("");

    console.log(
      "Project-specific biography updated for author:",
      editingProjectBiography.authorId,
    );
  };

  // Handler for canceling project-specific biography editing
  const handleCancelProjectBiography = () => {
    setEditingProjectBiography(null);
    setProjectBiographyText("");
  };

  // Series Management handlers
  const handleOpenSeriesManagement = () => {
    setIsSeriesManagementOpen(true);
    setSeriesManagementStep("selection");
    setSeriesCreationMode(null);
    setNewSeriesFormData(null);
    setSelectedSeriesId("");
  };

  const handleCloseSeriesManagement = () => {
    setIsSeriesManagementOpen(false);
    setSeriesManagementStep("selection");
    setSeriesCreationMode(null);
    setNewSeriesFormData(null);
    setSelectedSeriesId("");
  };

  const handleSeriesModeSelection = (mode: "existing" | "new") => {
    setSeriesCreationMode(mode);
    if (mode === "existing") {
      setSeriesManagementStep("form");
    } else {
      // Initialize form data for new series
      setNewSeriesFormData({
        name: "",
        description: "",
      });
      setSeriesManagementStep("form");
    }
  };

  const handleSeriesComplete = () => {
    if (seriesCreationMode === "existing" && selectedSeriesId) {
      const selectedSeries = mockSeries.find((s) => s.id === selectedSeriesId);
      if (selectedSeries) {
        const projectData = JSON.parse(
          localStorage.getItem(`project_${project.id}`) || "{}",
        );
        projectData.selectedSeries = selectedSeries;
        localStorage.setItem(
          `project_${project.id}`,
          JSON.stringify(projectData),
        );

        setSelectedProjectData((prev) => ({
          ...prev,
          selectedSeries: selectedSeries,
        }));
      }
    } else if (seriesCreationMode === "new" && newSeriesFormData) {
      // Create new series
      const newSeries = {
        id: `temp-series-${Date.now()}`,
        name: newSeriesFormData.name,
        description: newSeriesFormData.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const projectData = JSON.parse(
        localStorage.getItem(`project_${project.id}`) || "{}",
      );
      projectData.selectedSeries = newSeries;
      localStorage.setItem(
        `project_${project.id}`,
        JSON.stringify(projectData),
      );

      setSelectedProjectData((prev) => ({
        ...prev,
        selectedSeries: newSeries,
      }));
    }
    handleCloseSeriesManagement();
  };

  // Publisher Management handlers
  const handleOpenPublisherManagement = () => {
    setIsPublisherManagementOpen(true);
    setPublisherManagementStep("selection");
    setPublisherCreationMode(null);
    setNewPublisherFormData(null);
    setSelectedPublisherId("");
  };

  const handleClosePublisherManagement = () => {
    setIsPublisherManagementOpen(false);
    setPublisherManagementStep("selection");
    setPublisherCreationMode(null);
    setNewPublisherFormData(null);
    setSelectedPublisherId("");
  };

  const handlePublisherModeSelection = (mode: "existing" | "new") => {
    setPublisherCreationMode(mode);
    if (mode === "existing") {
      setPublisherManagementStep("form");
    } else {
      // Initialize form data for new publisher
      setNewPublisherFormData({
        name: "",
        description: "",
      });
      setPublisherManagementStep("form");
    }
  };

  const handlePublisherComplete = () => {
    if (publisherCreationMode === "existing" && selectedPublisherId) {
      const selectedPublisher = mockVerlagsmarken.find(
        (p) => p.id === selectedPublisherId,
      );
      if (selectedPublisher) {
        const projectData = JSON.parse(
          localStorage.getItem(`project_${project.id}`) || "{}",
        );
        projectData.selectedPublisher = selectedPublisher;
        localStorage.setItem(
          `project_${project.id}`,
          JSON.stringify(projectData),
        );

        setSelectedProjectData((prev) => ({
          ...prev,
          selectedPublisher: selectedPublisher,
        }));
      }
    } else if (publisherCreationMode === "new" && newPublisherFormData) {
      // Create new publisher
      const newPublisher = {
        id: `temp-publisher-${Date.now()}`,
        name: newPublisherFormData.name,
        description: newPublisherFormData.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const projectData = JSON.parse(
        localStorage.getItem(`project_${project.id}`) || "{}",
      );
      projectData.selectedPublisher = newPublisher;
      localStorage.setItem(
        `project_${project.id}`,
        JSON.stringify(projectData),
      );

      setSelectedProjectData((prev) => ({
        ...prev,
        selectedPublisher: newPublisher,
      }));
    }
    handleClosePublisherManagement();
  };

  // Handler for deleting series from project
  const handleDeleteSeries = () => {
    const projectData = JSON.parse(
      localStorage.getItem(`project_${project.id}`) || "{}",
    );
    delete projectData.selectedSeries;
    localStorage.setItem(`project_${project.id}`, JSON.stringify(projectData));

    setSelectedProjectData((prev) => ({
      ...prev,
      selectedSeries: undefined,
    }));
  };

  // Handler for deleting publisher from project
  const handleDeletePublisher = () => {
    const projectData = JSON.parse(
      localStorage.getItem(`project_${project.id}`) || "{}",
    );
    delete projectData.selectedPublisher;
    localStorage.setItem(`project_${project.id}`, JSON.stringify(projectData));

    setSelectedProjectData((prev) => ({
      ...prev,
      selectedPublisher: undefined,
    }));
  };

  return (
    <>
      <div className="mb-6 mt-8 space-y-6">
        {/* Authors Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Urheber</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenAuthorManagement}
                className="text-sm"
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Hinzufügen
              </Button>
            </div>
          </div>
          <div className="p-6">
            {localAuthors && localAuthors.length > 0 ? (
              <DraggableAuthorList
                authors={localAuthors}
                onOrderChange={handleAuthorOrderChange}
                onRemove={handleRemoveAuthor}
                onEditBasicData={handleEditAuthorBasicData}
                onEditProjectBiography={handleEditProjectBiography}
                projectId={project.id}
              />
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <UsersIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Noch keine Urheber hinzugefügt
                </p>
                <Button
                  variant="outline"
                  onClick={handleOpenAuthorManagement}
                  className="text-sm"
                >
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Ersten Urheber hinzufügen
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Optional Information - Compact Display */}
        {(selectedProjectData.selectedSeries ||
          selectedProjectData.selectedPublisher) && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Zusätzliche Informationen
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Series - Only show if exists */}
              {selectedProjectData.selectedSeries && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpenIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Buchreihe
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {selectedProjectData.selectedSeries.name}
                    </p>
                    {selectedProjectData.selectedSeries.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedProjectData.selectedSeries.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/buchmanagement#series">
                        <EditIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeleteSeries}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Publisher - Only show if exists */}
              {selectedProjectData.selectedPublisher && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <ExternalLinkIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Verlagsmarke
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {selectedProjectData.selectedPublisher.name}
                    </p>
                    {selectedProjectData.selectedPublisher.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedProjectData.selectedPublisher.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/buchmanagement/buchmanagement#verlagsmarken">
                        <EditIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeletePublisher}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Optional Information Buttons - Always show missing options */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4">
            {!selectedProjectData.selectedSeries && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenSeriesManagement}
                className="text-gray-600 hover:text-gray-900"
              >
                <BookOpenIcon className="h-4 w-4 mr-2" />
                Buchreihe hinzufügen
              </Button>
            )}
            {!selectedProjectData.selectedSeries &&
              !selectedProjectData.selectedPublisher && (
                <span className="text-gray-300">•</span>
              )}
            {!selectedProjectData.selectedPublisher && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenPublisherManagement}
                className="text-gray-600 hover:text-gray-900"
              >
                <ExternalLinkIcon className="h-4 w-4 mr-2" />
                Verlagsmarke hinzufügen
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Author Dialogs */}
      <AddAuthorDialog
        isOpen={isAuthorDialogOpen}
        onOpenChange={setIsAuthorDialogOpen}
        authors={mockAuthors}
        selectedAuthor={selectedAuthorId}
        selectedAuthorRole={selectedAuthorRoleLocal}
        selectedBiography={selectedBiographyId}
        authorBiographies={availableBiographies}
        handleAuthorChange={setSelectedAuthorId}
        setSelectedAuthorRole={setSelectedAuthorRoleLocal}
        setSelectedBiography={setSelectedBiographyId}
        handleAddAuthorToProject={() => {}}
        projectLanguages={project?.languages || []}
        existingProjectAuthors={localAuthors}
      />

      <NewAuthorDialog
        isOpen={isNewAuthorDialogOpen}
        onOpenChange={setIsNewAuthorDialogOpen}
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

      {/* Author Selection Dialog */}
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

      {/* Author Management Slideout */}
      <Sheet
        open={isAuthorManagementOpen}
        onOpenChange={setIsAuthorManagementOpen}
      >
        <SheetContent
          className="w-full sm:w-[800px] sm:max-w-[800px] overflow-y-auto"
          side="right"
        >
          <SheetHeader className="px-4 sm:px-6 text-left pb-6">
            <SheetTitle className="flex items-center gap-3 text-lg sm:text-xl text-left">
              <UsersIcon className="h-6 w-6 text-blue-600" />
              Urheber hinzufügen
            </SheetTitle>
            <SheetDescription className="text-sm sm:text-base mt-2 text-left">
              {authorManagementStep === "selection" &&
                "Wähle aus, ob du einen bestehenden Urheber auswählen oder einen neuen anlegen möchtest."}
              {authorManagementStep === "author-form" &&
                (authorCreationMode === "existing"
                  ? "Wähle einen bestehenden Urheber aus."
                  : "Lege einen neuen Urheber an.")}
              {authorManagementStep === "biography" &&
                "Erstelle eine Biografie für diesen Urheber in diesem Projekt."}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 sm:space-y-8 px-4 sm:px-6">
            {/* Step 1: Selection Mode */}
            {authorManagementStep === "selection" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={`p-6 border-2 border-dashed rounded-xl transition-all ${
                      isCleanUser()
                        ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                        : "border-gray-300 hover:border-green-400 hover:bg-green-50 cursor-pointer group"
                    }`}
                    onClick={() =>
                      !isCleanUser() && handleAuthorModeSelection("existing")
                    }
                  >
                    <div className="text-center">
                      <SearchIcon
                        className={`h-12 w-12 mx-auto mb-4 transition-colors ${
                          isCleanUser()
                            ? "text-gray-300"
                            : "text-gray-400 group-hover:text-green-500"
                        }`}
                      />
                      <h3
                        className={`font-semibold text-lg mb-2 ${
                          isCleanUser() ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        Bestehenden Urheber auswählen
                      </h3>
                      <p
                        className={`text-sm ${
                          isCleanUser() ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {isCleanUser()
                          ? "Keine gespeicherten Urheber vorhanden. Lege zuerst Urheber an."
                          : "Wähle einen bereits angelegten Urheber aus der Liste aus."}
                      </p>
                    </div>
                  </div>

                  <div
                    className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer group"
                    onClick={() => handleAuthorModeSelection("new")}
                  >
                    <div className="text-center">
                      <UserPlusIcon className="h-12 w-12 mx-auto mb-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        Neuen Urheber anlegen
                      </h3>
                      <p className="text-sm text-gray-600">
                        Erstelle einen komplett neuen Urheber.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Author Form */}
            {authorManagementStep === "author-form" && (
              <div className="space-y-6">
                {authorCreationMode === "existing" ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">
                      Bestehenden Urheber auswählen
                    </h3>
                    <div className="space-y-3">
                      <Label htmlFor="author-select">Urheber</Label>
                      <Select
                        value={selectedAuthorId}
                        onValueChange={setSelectedAuthorId}
                      >
                        <SelectTrigger id="author-select">
                          <SelectValue placeholder="Urheber auswählen" />
                        </SelectTrigger>
                        <SelectContent
                          className="max-h-[200px] overflow-y-auto"
                          position="popper"
                          sideOffset={5}
                        >
                          {mockAuthors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              <span className="font-medium">
                                {author.author_type === "person"
                                  ? `${author.first_name} ${author.last_name}`
                                  : author.company_name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="role-select">Rolle im Projekt</Label>
                      <Select
                        value={selectedAuthorRoleLocal}
                        onValueChange={(value) => {
                          // Only allow selection of non-assigned roles
                          const roleStatus = rolesWithStatus.find(
                            (r) => r.role === value,
                          );
                          if (!roleStatus?.isAssigned) {
                            setSelectedAuthorRoleLocal(value);
                          }
                        }}
                      >
                        <SelectTrigger id="role-select">
                          <SelectValue placeholder="Rolle auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {rolesWithStatus.map(({ role, isAssigned }) => (
                            <SelectItem
                              key={role}
                              value={role}
                              disabled={isAssigned}
                              className={isAssigned ? "text-gray-400" : ""}
                            >
                              {role}
                              {isAssigned ? " (bereits vergeben)" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedAuthorId && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                        <h5 className="font-medium text-sm text-gray-900 mb-2">
                          Ausgewählter Urheber:
                        </h5>
                        <div className="text-left">
                          {(() => {
                            const author = mockAuthors.find(
                              (a) => a.id === selectedAuthorId,
                            );
                            return author ? (
                              <div>
                                <p className="font-medium text-sm mb-1">
                                  {author.author_type === "person"
                                    ? `${author.first_name} ${author.last_name}`
                                    : author.company_name}
                                </p>
                                {author.profession && (
                                  <p className="text-sm text-gray-600">
                                    {author.profession}
                                  </p>
                                )}
                              </div>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">
                      Neuen Urheber anlegen
                    </h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-blue-800">
                            Hier werden nur die Grunddaten des Urhebers erfasst.
                            Weitere Details können später in der{" "}
                            <Link
                              to="/buchmanagement#authors"
                              className="text-blue-700 hover:text-blue-900 underline decoration-2 hover:decoration-4 transition-all font-medium"
                            >
                              Urheberverwaltung
                            </Link>{" "}
                            ergänzt und bearbeitet werden.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Neuen Urheber Formular */}
                    {newAuthorFormData && (
                      <AuthorBasicDataForm
                        author={newAuthorFormData}
                        onSave={handleNewAuthorFormSave}
                        onCancel={handleNewAuthorFormCancel}
                        showButtons={false}
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Biography */}
            {authorManagementStep === "biography" && selectedAuthorForBio && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    Biografie für{" "}
                    {selectedAuthorForBio.author_type === "person"
                      ? `${selectedAuthorForBio.first_name} ${selectedAuthorForBio.last_name}`
                      : selectedAuthorForBio.company_name}
                  </h3>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h5 className="font-medium text-blue-900 mb-2">
                        Empfehlung: Projektbezogene Biografie
                      </h5>
                      <p className="text-sm text-blue-800">
                        Wir empfehlen, für jedes Buch eine eigene Biografie zu
                        erstellen. So kannst du die Schwerpunkte des Lebenslaufs
                        hervorheben, die die Glaubwürdigkeit des Urhebers für
                        dieses spezielle Thema erhöhen.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        biographyChoice === "new"
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 hover:border-green-300 hover:bg-green-25"
                      }`}
                      onClick={() => {
                        setBiographyChoice("new");
                        // Pre-populate with standard biography text if available
                        if (selectedAuthorForBio) {
                          const standardBio = getStandardBiographyForAuthor(
                            selectedAuthorForBio.id,
                          );
                          if (standardBio && standardBio.biography_text) {
                            setNewBiographyText(standardBio.biography_text);
                          } else {
                            setNewBiographyText("");
                          }
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            biographyChoice === "new"
                              ? "border-green-500 bg-green-500"
                              : "border-gray-400"
                          }`}
                        >
                          {biographyChoice === "new" && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            Neue projektbezogene Biografie erstellen (empfohlen)
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Erstelle eine Biografie, die speziell auf dieses
                            Buchprojekt zugeschnitten ist.
                          </p>
                        </div>
                      </div>
                    </div>

                    {slideoutAvailableBiographies.length > 0 && (
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          biographyChoice === "existing"
                            ? "border-green-400 bg-green-50"
                            : "border-gray-300 hover:border-green-300 hover:bg-green-25"
                        }`}
                        onClick={() => setBiographyChoice("existing")}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              biographyChoice === "existing"
                                ? "border-green-500 bg-green-500"
                                : "border-gray-400"
                            }`}
                          >
                            {biographyChoice === "existing" && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              Bestehende Standard-Biografie verwenden
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Verwende eine bereits vorhandene Biografie dieses
                              Urhebers.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        biographyChoice === "none"
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 hover:border-green-300 hover:bg-green-25"
                      }`}
                      onClick={() => setBiographyChoice("none")}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            biographyChoice === "none"
                              ? "border-green-500 bg-green-500"
                              : "border-gray-400"
                          }`}
                        >
                          {biographyChoice === "none" && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            Keine Biografie hinzufügen
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Füge diesem Urheber keine Biografie hinzu.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {biographyChoice === "new" && (
                    <div className="space-y-3 mt-4">
                      <Label htmlFor="new-biography">
                        Projektbezogene Biografie
                      </Label>
                      <Textarea
                        id="new-biography"
                        value={newBiographyText}
                        onChange={(e) => setNewBiographyText(e.target.value)}
                        placeholder="Schreibe eine Biografie, die speziell die Qualifikationen und Erfahrungen hervorhebt, die für dieses Buchprojekt relevant sind..."
                        rows={6}
                        className="bg-white text-black placeholder:text-gray-400"
                      />
                      <p className="text-xs text-gray-500">
                        Tipp: Betone Erfahrungen, Qualifikationen oder Erfolge,
                        die direkt mit dem Thema deines Buches zusammenhängen.
                      </p>
                    </div>
                  )}

                  {biographyChoice === "existing" &&
                    slideoutAvailableBiographies.length > 0 && (
                      <div className="space-y-3 mt-4">
                        <Label htmlFor="existing-biography">
                          Standard-Biografie
                        </Label>
                        <div className="p-4 bg-gray-100 rounded-lg border">
                          <h5 className="font-medium text-sm text-gray-900 mb-2">
                            {slideoutAvailableBiographies[0].biography_label ||
                              "Standard"}{" "}
                            (
                            {slideoutAvailableBiographies[0].language ||
                              "Deutsch"}
                            )
                          </h5>
                          <p className="text-sm text-black leading-relaxed">
                            {slideoutAvailableBiographies[0].biography_text}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="mt-6 px-4 sm:px-6 flex-col sm:flex-row gap-2 sm:gap-0">
            {authorManagementStep === "selection" && (
              <Button
                variant="outline"
                onClick={handleCloseAuthorManagement}
                className="w-full sm:w-auto"
              >
                <XIcon className="h-4 w-4 mr-2" />
                Abbrechen
              </Button>
            )}

            {authorManagementStep === "author-form" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setAuthorManagementStep("selection")}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
                <Button
                  onClick={() => {
                    if (authorCreationMode === "existing" && selectedAuthorId) {
                      // Check if author with this role already exists before proceeding
                      const existingAuthor = localAuthors.find(
                        (author) =>
                          author.author_id === selectedAuthorId &&
                          author.author_role === selectedAuthorRoleLocal,
                      );

                      if (existingAuthor) {
                        alert(
                          "Dieser Urheber ist bereits mit dieser Rolle im Projekt zugeordnet.",
                        );
                        return;
                      }

                      const author = mockAuthors.find(
                        (a) => a.id === selectedAuthorId,
                      );
                      if (author) {
                        handleAuthorSelected(author);
                      }
                    } else if (
                      authorCreationMode === "new" &&
                      newAuthorFormData
                    ) {
                      // Trigger form submission to show validation errors
                      const formElement =
                        document.getElementById("author-form");
                      if (formElement) {
                        const submitEvent = new Event("submit", {
                          bubbles: true,
                          cancelable: true,
                        });
                        formElement.dispatchEvent(submitEvent);
                      }
                    }
                  }}
                  disabled={
                    (authorCreationMode === "existing" &&
                      (!selectedAuthorId || availableRoles.length === 0)) ||
                    (authorCreationMode === "new" && !newAuthorFormData)
                  }
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  <ArrowRightIcon className="h-4 w-4 mr-2" />
                  Weiter
                </Button>
              </>
            )}

            {authorManagementStep === "biography" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setAuthorManagementStep("author-form")}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
                <Button
                  onClick={handleBiographyComplete}
                  disabled={
                    !biographyChoice ||
                    (biographyChoice === "new" && !newBiographyText.trim())
                  }
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Urheber hinzufügen
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Project-specific Biography Edit Dialog */}
      <Dialog
        open={!!editingProjectBiography}
        onOpenChange={(open) => !open && handleCancelProjectBiography()}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Projektbezogene Biografie bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeite die Biografie für diesen Urheber in diesem Projekt.
              Diese Änderung wirkt sich nur auf dieses Projekt aus.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="project-biography">Biografie-Text</Label>
              <Textarea
                id="project-biography"
                value={projectBiographyText}
                onChange={(e) => setProjectBiographyText(e.target.value)}
                placeholder="Schreibe eine projektbezogene Biografie, die speziell die Qualifikationen und Erfahrungen hervorhebt, die für dieses Buchprojekt relevant sind..."
                rows={8}
                className="mt-2 bg-gray-100 text-black"
              />
              <p className="text-xs text-gray-500 mt-2">
                Tipp: Betone Erfahrungen, Qualifikationen oder Erfolge, die
                direkt mit dem Thema deines Buches zusammenhängen.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelProjectBiography}>
              <XIcon className="h-4 w-4 mr-2" />
              Abbrechen
            </Button>
            <Button
              onClick={handleSaveProjectBiography}
              disabled={!projectBiographyText.trim()}
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Series Management Modal */}
      <EntityCreationModal
        isOpen={isSeriesManagementOpen}
        onOpenChange={setIsSeriesManagementOpen}
        entityType="series"
        existingEntities={mockSeries}
        onComplete={(mode, data) => {
          if (mode === "existing") {
            const projectData = JSON.parse(
              localStorage.getItem(`project_${project.id}`) || "{}",
            );
            projectData.selectedSeries = data;
            localStorage.setItem(
              `project_${project.id}`,
              JSON.stringify(projectData),
            );

            setSelectedProjectData((prev) => ({
              ...prev,
              selectedSeries: data,
            }));
          } else if (mode === "new") {
            // Create new series
            const newSeries = {
              id: `temp-series-${Date.now()}`,
              name: data.name,
              description: data.description,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            const projectData = JSON.parse(
              localStorage.getItem(`project_${project.id}`) || "{}",
            );
            projectData.selectedSeries = newSeries;
            localStorage.setItem(
              `project_${project.id}`,
              JSON.stringify(projectData),
            );

            setSelectedProjectData((prev) => ({
              ...prev,
              selectedSeries: newSeries,
            }));
          }
        }}
      />

      {/* Publisher Management Modal */}
      <EntityCreationModal
        isOpen={isPublisherManagementOpen}
        onOpenChange={setIsPublisherManagementOpen}
        entityType="publisher"
        existingEntities={mockVerlagsmarken}
        onComplete={(mode, data) => {
          if (mode === "existing") {
            const projectData = JSON.parse(
              localStorage.getItem(`project_${project.id}`) || "{}",
            );
            projectData.selectedPublisher = data;
            localStorage.setItem(
              `project_${project.id}`,
              JSON.stringify(projectData),
            );

            setSelectedProjectData((prev) => ({
              ...prev,
              selectedPublisher: data,
            }));
          } else if (mode === "new") {
            // Create new publisher
            const newPublisher = {
              id: `temp-publisher-${Date.now()}`,
              name: data.name,
              description: data.description,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            const projectData = JSON.parse(
              localStorage.getItem(`project_${project.id}`) || "{}",
            );
            projectData.selectedPublisher = newPublisher;
            localStorage.setItem(
              `project_${project.id}`,
              JSON.stringify(projectData),
            );

            setSelectedProjectData((prev) => ({
              ...prev,
              selectedPublisher: newPublisher,
            }));
          }
        }}
      />
    </>
  );
};

export default AuthorPublisherSection;
