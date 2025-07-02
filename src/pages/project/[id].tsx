import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import ProjectHeader from "@/components/Project/ProjectHeader";
import ProjectCover from "@/components/Project/ProjectCover";
import ProjectDetails from "@/components/Project/ProjectDetails";
// SimplifiedProjectTabs removed as requested
import ProjectEditForm from "@/components/Project/ProjectEditForm";
import EditionsList from "@/components/Project/EditionsList";
import AddEditionDialog from "@/components/Project/dialogs/AddEditionDialog";
import AddAuthorDialog from "@/components/Project/dialogs/AddAuthorDialog";
import NewAuthorDialog from "@/components/Project/dialogs/NewAuthorDialog";
import { fetchProjectById } from "@/lib/api/projects";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  GitCompareIcon as CompareIcon,
  XIcon,
  UserIcon,
  TrashIcon,
  BookOpenIcon,
  BookIcon,
  TabletIcon,
  FileTextIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  PlusCircleIcon,
  EditIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  author_type: "person" | "organization";
  is_pseudonym: boolean;
  display_order?: number;
  author_role?: string;
  biography_id?: string;
  biography_text?: string;
}

interface Edition {
  id: string;
  title: string;
  produktform: string;
  ausgabenart?: string;
  price: number;
  pages?: number;
  status: string;
  is_complete: boolean;
  format_complete: boolean;
  content_complete: boolean;
  cover_complete: boolean;
  pricing_complete: boolean;
  authors_complete: boolean;
  isbn?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  cover_image?: string;
  languages: string[];
  genres: string[];
  target_audience?: string;
  target_audience_groups?: string[];
  slogan?: string;
  selling_points?: string;
  keywords?: string;
  authors?: Author[];
  editions?: Edition[];
}

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  console.log("Extracted ID from route params:", id);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [allAuthors, setAllAuthors] = useState<any[]>([]);
  const [authorBiographies, setAuthorBiographies] = useState<any[]>([]);

  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<any>(null);
  const [isPublishingModalOpen, setIsPublishingModalOpen] = useState(false);
  const [reorderingAuthors, setReorderingAuthors] = useState(false);
  const [isAddEditionDialogOpen, setIsAddEditionDialogOpen] = useState(false);
  const [isAuthorDialogOpen, setIsAuthorDialogOpen] = useState(false);
  const [isNewAuthorDialogOpen, setIsNewAuthorDialogOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [selectedAuthorRole, setSelectedAuthorRole] = useState<string>("Autor");
  const [selectedBiography, setSelectedBiography] = useState<string>("");
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // State for version tabs and comparison mode
  const [activeTab, setActiveTab] = useState("editing");
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [publishedProject, setPublishedProject] = useState<Project | null>(
    null,
  );

  // State for edition tabs
  const [activeEditionTab, setActiveEditionTab] = useState<string>("");

  // Check if tour should start on this page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const startTour = urlParams.get("startTour");
    const hasSeenTour = localStorage.getItem(`hasSeenTour_${id}`);

    // Start tour automatically for new projects (frontend- prefix) or when startTour=true
    if (
      (startTour === "true" || (id && id.startsWith("frontend-"))) &&
      !hasSeenTour &&
      project
    ) {
      setShowTour(true);
      // Remove the parameter from URL if it exists
      if (startTour === "true") {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    }
  }, [id, project]);

  // Tour functions
  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      closeTour();
    }
  };

  const closeTour = () => {
    setShowTour(false);
    localStorage.setItem(`hasSeenTour_${id}`, "true");
  };

  // Function to get target element position for spotlight effect
  const getTargetElementPosition = (targetId: string) => {
    const element = document.querySelector(`[data-tour-target="${targetId}"]`);
    if (!element) return {};

    const rect = element.getBoundingClientRect();
    const padding = 8; // Extra padding around the element

    return {
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
      borderRadius: "8px",
    };
  };

  const tourSteps = [
    {
      title: "Willkommen zu Ihrem neuen Buchprojekt!",
      content:
        "Hier können Sie alle Details Ihres Buchprojekts verwalten und bearbeiten.",
      target: null,
    },
    {
      title: "Projektdetails bearbeiten",
      content:
        "Klicken Sie auf 'Bearbeiten', um Titel, Beschreibung, Genres und andere Details hinzuzufügen.",
      target: "edit-button",
    },
    {
      title: "Ausgaben hinzufügen",
      content:
        "Hier können Sie verschiedene Ausgaben Ihres Buchs erstellen (Softcover, Hardcover, E-Book).",
      target: "editions-section",
    },
    {
      title: "Projekt veröffentlichen",
      content:
        "Wenn Ihr Projekt bereit ist, können Sie es hier veröffentlichen.",
      target: "publish-button",
    },
  ];

  useEffect(() => {
    const loadProject = async () => {
      console.log("Loading project with ID:", id);
      if (!id || id === "[id]") {
        console.error("No valid project ID provided");
        setError("No valid project ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if this is a frontend-only project
        if (id.startsWith("frontend-")) {
          console.log("Loading frontend-only project with ID:", id);

          // Try to get project data from localStorage first
          const frontendProjects = JSON.parse(
            localStorage.getItem("frontendProjects") || "{}",
          );
          console.log(
            "All frontend projects in localStorage:",
            frontendProjects,
          );
          const storedProject = frontendProjects[id];
          console.log("Stored project for ID", id, ":", storedProject);

          let mockProject: Project;
          if (storedProject) {
            console.log("Found stored frontend project:", storedProject);
            mockProject = {
              id: storedProject.id,
              title: storedProject.title || "Neues Buchprojekt",
              description:
                storedProject.description ||
                "Ein neues Buchprojekt, das gerade erstellt wurde.",
              cover_image:
                storedProject.cover_image ||
                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
              languages: storedProject.languages || ["Deutsch"],
              genres: storedProject.genres || [],
              target_audience: storedProject.target_audience || "",
              target_audience_groups:
                storedProject.target_audience_groups || [],
              slogan: storedProject.slogan || "",
              selling_points: storedProject.selling_points || "",
              keywords: storedProject.keywords || "",
            };
          } else {
            console.log(
              "No stored project found, creating default mock project",
            );
            // Create a default mock project for frontend-only projects
            mockProject = {
              id: id,
              title: "Neues Buchprojekt",
              description: "Ein neues Buchprojekt, das gerade erstellt wurde.",
              cover_image:
                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
              languages: ["Deutsch"],
              genres: [],
              target_audience: "",
              target_audience_groups: [],
              slogan: "",
              selling_points: "",
              keywords: "",
            };
          }

          console.log("Setting project data:", mockProject);
          setProject(mockProject);
          setAuthors([]);
          setEditions([]);
          setLoading(false);
          return;
        }

        // Create different mock data for each project
        const getMockDataByProject = (projectId: string) => {
          const mockDataSets = {
            "1": {
              project: {
                id: projectId,
                title: "Digitales Publizieren Meistern",
                subtitle: "Der komplette Leitfaden für Self-Publisher",
                description:
                  "Ein vollständiger Leitfaden für Autoren, die ihre Bücher digital und im Print-on-Demand veröffentlichen möchten. Von der Manuskripterstellung bis zur erfolgreichen Vermarktung.",
                cover_image:
                  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
                languages: ["Deutsch"],
                genres: ["non-fiction.publishing", "business", "education"],
                series: "series-1",
                publisher: "Eigenverlag Premium",
                created_at: "2023-08-01T10:00:00Z",
                updated_at: "2023-12-15T16:30:00Z",
                user_id: "user-1",
                target_audience:
                  "Angehende Self-Publisher und erfahrene Autoren",
                target_audience_groups: [
                  "Erwachsene",
                  "Fachpublikum",
                  "Unternehmer",
                ],
                slogan: "Vom Manuskript zum Marktführer",
                selling_points:
                  "Schritt-für-Schritt Anleitung, Praxiserprobte Strategien, Insider-Tipps, Rechtliche Hinweise, Marketingvorlagen",
                keywords:
                  "Self-Publishing, Digitales Publizieren, Buchvermarktung, Print-on-Demand, E-Book, Autorenleitfaden",
              },
              editions: [
                {
                  id: "5",
                  project_id: projectId,
                  title: "Vollständige Ausgabe",
                  produktform: "Softcover",
                  ausgabenart: "Standardausgabe",
                  price: 29.99,
                  pages: 450,
                  status: "Veröffentlicht",
                  isbn: "978-3-987654-32-1",
                  cover_image:
                    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
                  is_complete: true,
                  format_complete: true,
                  content_complete: true,
                  cover_complete: true,
                  pricing_complete: true,
                  authors_complete: true,
                },
                {
                  id: "6",
                  project_id: projectId,
                  title: "Premium Hardcover Edition",
                  produktform: "Hardcover",
                  ausgabenart: "Sonderedition",
                  price: 49.99,
                  pages: 450,
                  status: "Im Verkauf",
                  isbn: "978-3-987654-33-8",
                  cover_image:
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
                  is_complete: true,
                  format_complete: true,
                  content_complete: true,
                  cover_complete: true,
                  pricing_complete: true,
                  authors_complete: true,
                },
              ],
              authors: [
                {
                  id: "7",
                  project_id: projectId,
                  author_id: "7",
                  author_role: "Hauptautor",
                  display_order: 0,
                  authors: {
                    id: "7",
                    first_name: "Dr. Sarah",
                    last_name: "Hoffmann",
                    author_type: "person",
                    is_pseudonym: false,
                    birth_date: "1985-04-12",
                    profession: "Verlagsexpertin und Digitalisierungsberaterin",
                    website: "www.sarah-hoffmann-publishing.de",
                  },
                  author_biographies: {
                    biography_text:
                      "Dr. Sarah Hoffmann ist eine renommierte Verlagsexpertin und Digitalisierungsberaterin mit über 10 Jahren Erfahrung in der Branche.",
                    language: "de",
                  },
                },
              ],
            },
            "2": {
              project: {
                id: projectId,
                title: "Kreatives Schreiben für Anfänger",
                subtitle: "Von der Idee zum fertigen Roman",
                description:
                  "Ein praktischer Ratgeber für alle, die ihren ersten Roman schreiben möchten. Mit Übungen, Tipps und Techniken von erfolgreichen Autoren.",
                cover_image:
                  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
                languages: ["Deutsch"],
                genres: ["non-fiction.writing", "education", "creativity"],
                series: "series-2",
                publisher: "Kreativ Verlag",
                created_at: "2023-09-15T14:00:00Z",
                updated_at: "2023-12-20T10:15:00Z",
                user_id: "user-2",
                target_audience: "Schreibanfänger und Hobbyautoren",
                target_audience_groups: [
                  "Erwachsene",
                  "Hobbyisten",
                  "Kreative",
                ],
                slogan: "Jeder kann schreiben lernen",
                selling_points:
                  "Praktische Übungen, Schritt-für-Schritt Anleitung, Motivationstipps, Charakterentwicklung, Plotstrukturen",
                keywords:
                  "Kreatives Schreiben, Roman schreiben, Schreibtipps, Storytelling, Charakterentwicklung, Plot",
              },
              editions: [
                {
                  id: "8",
                  project_id: projectId,
                  title: "Basis Edition",
                  produktform: "Softcover",
                  ausgabenart: "Standardausgabe",
                  price: 24.99,
                  pages: 320,
                  status: "Veröffentlicht",
                  isbn: "978-3-987654-34-5",
                  cover_image:
                    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80",
                  is_complete: true,
                  format_complete: true,
                  content_complete: true,
                  cover_complete: true,
                  pricing_complete: true,
                  authors_complete: true,
                },
              ],
              authors: [
                {
                  id: "8",
                  project_id: projectId,
                  author_id: "8",
                  author_role: "Autor",
                  display_order: 0,
                  authors: {
                    id: "8",
                    first_name: "Maria",
                    last_name: "Schreiber",
                    author_type: "person",
                    is_pseudonym: false,
                    birth_date: "1978-11-22",
                    profession: "Schriftstellerin und Schreibcoach",
                    website: "www.maria-schreiber.de",
                  },
                  author_biographies: {
                    biography_text:
                      "Maria Schreiber ist eine erfolgreiche Schriftstellerin und Schreibcoach mit über 15 Jahren Erfahrung im kreativen Schreiben.",
                    language: "de",
                  },
                },
              ],
            },
            "3": {
              project: {
                id: projectId,
                title: "Marketing für Kleinunternehmen",
                subtitle: "Erfolgreich werben mit kleinem Budget",
                description:
                  "Praktische Marketingstrategien speziell für kleine Unternehmen und Startups. Lernen Sie, wie Sie mit begrenzten Ressourcen maximale Wirkung erzielen.",
                cover_image:
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
                languages: ["Deutsch"],
                genres: [
                  "non-fiction.business",
                  "non-fiction.marketing",
                  "entrepreneurship",
                ],
                series: "series-3",
                publisher: "Business Verlag",
                created_at: "2023-10-01T09:30:00Z",
                updated_at: "2023-12-18T15:45:00Z",
                user_id: "user-3",
                target_audience: "Kleinunternehmer und Startup-Gründer",
                target_audience_groups: [
                  "Erwachsene",
                  "Unternehmer",
                  "Fachpublikum",
                ],
                slogan: "Großer Erfolg, kleines Budget",
                selling_points:
                  "Kosteneffektive Strategien, Praxisbeispiele, Social Media Marketing, Lokales Marketing, Messbare Ergebnisse",
                keywords:
                  "Marketing, Kleinunternehmen, Startup, Social Media, Werbung, Budget, ROI, Kundengewinnung",
              },
              editions: [
                {
                  id: "9",
                  project_id: projectId,
                  title: "Standard Edition",
                  produktform: "Softcover",
                  ausgabenart: "Standardausgabe",
                  price: 27.99,
                  pages: 380,
                  status: "Veröffentlicht",
                  isbn: "978-3-987654-35-2",
                  cover_image:
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
                  is_complete: true,
                  format_complete: true,
                  content_complete: true,
                  cover_complete: true,
                  pricing_complete: true,
                  authors_complete: true,
                },
                {
                  id: "10",
                  project_id: projectId,
                  title: "E-Book Edition",
                  produktform: "E-Book",
                  ausgabenart: "Standardausgabe",
                  price: 19.99,
                  pages: 380,
                  status: "Im Verkauf",
                  isbn: "978-3-987654-36-9",
                  cover_image:
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
                  is_complete: true,
                  format_complete: true,
                  content_complete: true,
                  cover_complete: true,
                  pricing_complete: true,
                  authors_complete: true,
                },
              ],
              authors: [
                {
                  id: "9",
                  project_id: projectId,
                  author_id: "9",
                  author_role: "Autor",
                  display_order: 0,
                  authors: {
                    id: "9",
                    first_name: "Thomas",
                    last_name: "Marketing",
                    author_type: "person",
                    is_pseudonym: false,
                    birth_date: "1982-07-15",
                    profession: "Marketingberater und Unternehmer",
                    website: "www.thomas-marketing.com",
                  },
                  author_biographies: {
                    biography_text:
                      "Thomas Marketing ist ein erfahrener Marketingberater, der bereits über 200 Kleinunternehmen zum Erfolg verholfen hat.",
                    language: "de",
                  },
                },
              ],
            },
          };

          // Return the specific mock data set or default to project 3's structure for new projects
          return (
            mockDataSets[projectId] || {
              project: {
                ...mockDataSets["3"].project,
                id: projectId,
                title: "Neues Buchprojekt",
                subtitle: "",
                description:
                  "Ein neues Buchprojekt, das gerade erstellt wurde.",
                cover_image:
                  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                target_audience: "",
                target_audience_groups: [],
                slogan: "",
                selling_points: "",
                keywords: "",
              },
              editions: [],
              authors: [],
            }
          );
        };

        // Use different mock data for projects 1, 2, and 3
        if (id === "1" || id === "2" || id === "3") {
          console.log(`Loading mock project data for ID ${id}`);
          const {
            project: mockProject,
            editions: mockEditions,
            authors: mockAuthors,
          } = getMockDataByProject(id);

          console.log("Setting mock project data:", mockProject);
          console.log("Setting mock editions data:", mockEditions);
          console.log("Setting mock authors data:", mockAuthors);

          setProject(mockProject);
          setAuthors(mockAuthors);
          setEditions(mockEditions);
          setLoading(false);
          return;
        }

        // Fetch project data from database for other real projects
        const { data: projectData, error: projectError } =
          await fetchProjectById(id);

        if (projectError) {
          throw projectError;
        }

        if (!projectData) {
          throw new Error("Project not found");
        }

        console.log("Project data loaded:", projectData);

        // Fetch authors for this project
        console.log("Fetching authors for project ID:", id);
        const { data: projectAuthors, error: authorsError } = await supabase
          .from("project_authors")
          .select(
            `
            *,
            authors(*),
            author_biographies(*)
          `,
          )
          .eq("project_id", id);

        console.log("Authors data fetched:", projectAuthors);

        if (authorsError) {
          console.error("Error fetching project authors:", authorsError);
        }

        // Fetch editions for this project
        console.log("Fetching editions for project ID:", id);
        const { data: editionsData, error: editionsError } = await supabase
          .from("editions")
          .select("*")
          .eq("project_id", id);

        console.log("Editions data fetched:", editionsData);
        console.log("Number of editions found:", editionsData?.length || 0);
        if (editionsError) {
          console.error("Error fetching editions:", editionsError);
        }

        // Set all the data
        setProject(projectData);
        console.log("Setting authors data:", projectAuthors || []);
        setAuthors(projectAuthors || []);
        console.log("Setting editions data:", editionsData || []);
        console.log("About to set editions state with:", editionsData);
        setEditions(editionsData || []);
        console.log("Editions state should now be set");
      } catch (err: any) {
        console.error("Error loading project:", err);
        setError(err.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  // This useEffect has been replaced with a more robust version above

  // Initialize editedProject when project data changes
  useEffect(() => {
    if (project) {
      console.log("Updating editedProject with:", project);
      // Always update editedProject when project changes
      const updatedEditedProject = {
        ...project,
        // Map fields that have different names in the form
        targetAudience: project.target_audience,
        targetAudienceGroups: project.target_audience_groups,
        sellingPoints: project.selling_points,
      };
      console.log("Setting editedProject to:", updatedEditedProject);
      setEditedProject(updatedEditedProject);

      // Create a mock published version with some differences if not already set
      if (!publishedProject) {
        const mockPublishedVersion = {
          ...project,
          title: project.title
            ? project.title + " (Veröffentlicht)"
            : "Unbenanntes Projekt (Veröffentlicht)",
          description: project.description
            ? project.description.substring(0, 50) +
              "... (Veröffentlichte Version)"
            : "",
          slogan: project.slogan
            ? project.slogan.split(" ").slice(0, 2).join(" ")
            : "",
        };
        setPublishedProject(mockPublishedVersion);
      }

      // Log the current state for debugging
      console.log("Current state after project update:", {
        project,
        editedProject: {
          ...project,
          targetAudience: project.target_audience,
          targetAudienceGroups: project.target_audience_groups,
          sellingPoints: project.selling_points,
        },
        authors,
        editions,
      });
    }
  }, [project, publishedProject, authors, editions]);

  // Set initial active edition tab when editions change
  useEffect(() => {
    if (editions.length > 0 && !activeEditionTab) {
      setActiveEditionTab(editions[0].id);
    }
  }, [editions, activeEditionTab]);

  // Functions required by ProjectHeader
  const isProjectDetailsComplete = () => {
    return !!(
      project?.title &&
      project?.description &&
      project?.languages?.length > 0 &&
      project?.genres?.length > 0
    );
  };

  const isProjectReadyForPublishing = () => {
    return isProjectDetailsComplete() && editions.length > 0;
  };

  // Check if project has published editions
  const hasPublishedEditions = useMemo(() => {
    console.log("Checking hasPublishedEditions with editions:", editions);
    const result = editions.some(
      (edition) =>
        edition.status === "Veröffentlicht" || edition.status === "Im Verkauf",
    );
    console.log("hasPublishedEditions result:", result);
    return result;
  }, [editions]);

  const handleEditToggle = () => {
    console.log("Edit toggle clicked");
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    if (editedProject) {
      console.log("Saving changes to project:", editedProject);
      // Map form fields back to API field names
      const updatedProject = {
        ...editedProject,
        target_audience: editedProject.targetAudience,
        target_audience_groups: editedProject.targetAudienceGroups,
        selling_points: editedProject.sellingPoints,
      };
      setProject(updatedProject);

      // In a real app, we would make an API call here to save the changes
      if (id) {
        try {
          const { updateProject } = require("@/lib/api/projects");
          console.log(
            "Calling updateProject with ID:",
            id,
            "and data:",
            updatedProject,
          );
          updateProject(id, updatedProject);
        } catch (error) {
          console.error("Error updating project:", error);
        }
      }
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset editedProject to original project data
    if (project) {
      const resetProject = {
        ...project,
        targetAudience: project.target_audience,
        targetAudienceGroups: project.target_audience_groups,
        sellingPoints: project.selling_points,
      };
      setEditedProject(resetProject);
    }
  };

  // Make handleCancelEdit available globally for the form
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.handleCancelEdit = handleCancelEdit;
    }
    return () => {
      if (typeof window !== "undefined") {
        delete window.handleCancelEdit;
      }
    };
  }, [project]);

  // Handle input changes for the edit form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedProject((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes for the edit form
  const handleSelectChange = (name: string, value: any) => {
    setEditedProject((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to get differences between published and edited project
  const getProjectDifferences = () => {
    if (!publishedProject || !editedProject) return [];

    const differences = [];

    // Compare basic fields
    if (publishedProject.title !== editedProject.title) {
      differences.push({
        field: "Titel",
        oldValue: publishedProject.title,
        newValue: editedProject.title,
      });
    }

    if (publishedProject.subtitle !== editedProject.subtitle) {
      differences.push({
        field: "Untertitel",
        oldValue: publishedProject.subtitle || "(Leer)",
        newValue: editedProject.subtitle || "(Leer)",
      });
    }

    if (publishedProject.description !== editedProject.description) {
      differences.push({
        field: "Beschreibung",
        oldValue: publishedProject.description,
        newValue: editedProject.description,
      });
    }

    if (publishedProject.slogan !== editedProject.slogan) {
      differences.push({
        field: "Slogan",
        oldValue: publishedProject.slogan || "(Leer)",
        newValue: editedProject.slogan || "(Leer)",
      });
    }

    if (publishedProject.target_audience !== editedProject.targetAudience) {
      differences.push({
        field: "Zielgruppe",
        oldValue: publishedProject.target_audience || "(Leer)",
        newValue: editedProject.targetAudience || "(Leer)",
      });
    }

    if (publishedProject.selling_points !== editedProject.sellingPoints) {
      differences.push({
        field: "Kaufargumente",
        oldValue: publishedProject.selling_points || "(Leer)",
        newValue: editedProject.sellingPoints || "(Leer)",
      });
    }

    if (publishedProject.keywords !== editedProject.keywords) {
      differences.push({
        field: "Schlagworte",
        oldValue: publishedProject.keywords || "(Leer)",
        newValue: editedProject.keywords || "(Leer)",
      });
    }

    // Compare arrays (languages, genres, target_audience_groups)
    const compareArrays = (field, label, publishedArray, editedArray) => {
      const published = publishedArray || [];
      const edited = editedArray || [];

      if (JSON.stringify(published) !== JSON.stringify(edited)) {
        differences.push({
          field: label,
          oldValue: published.length ? published.join(", ") : "(Leer)",
          newValue: edited.length ? edited.join(", ") : "(Leer)",
        });
      }
    };

    compareArrays(
      "languages",
      "Sprachen",
      publishedProject.languages,
      editedProject.languages,
    );
    compareArrays(
      "genres",
      "Genres",
      publishedProject.genres,
      editedProject.genres,
    );
    compareArrays(
      "target_audience_groups",
      "Zielgruppen-Klassifikation",
      publishedProject.target_audience_groups,
      editedProject.targetAudienceGroups,
    );

    return differences;
  };

  // Function to highlight changed fields in the project details
  const isFieldChanged = (fieldName) => {
    const differences = getProjectDifferences();
    return differences.some((diff) => diff.field === fieldName);
  };

  // Function to get icon for product form
  const getProductFormIcon = (produktform: string) => {
    switch (produktform?.toLowerCase()) {
      case "softcover":
        return <BookOpenIcon className="h-6 w-6" />;
      case "hardcover":
        return <BookIcon className="h-6 w-6" />;
      case "e-book":
        return <TabletIcon className="h-6 w-6" />;
      default:
        return <FileTextIcon className="h-6 w-6" />;
    }
  };

  // Function to get status color and icon
  const getStatusInfo = (edition: Edition) => {
    const isComplete = edition.is_complete;
    const status = edition.status;

    if (status === "Veröffentlicht" || status === "Im Verkauf") {
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircleIcon className="h-3 w-3" />,
        text: status === "Im Verkauf" ? "Im Verkauf" : "Veröffentlicht",
      };
    } else if (isComplete) {
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <CheckCircleIcon className="h-3 w-3" />,
        text: "Bereit",
      };
    } else {
      return {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: <AlertCircleIcon className="h-3 w-3" />,
        text: "In Bearbeitung",
      };
    }
  };

  // Handle author selection change
  const handleAuthorChange = (authorId: string) => {
    setSelectedAuthor(authorId);
    setSelectedBiography("");

    // Find biographies for the selected author
    if (authorId) {
      // Import and use mock biographies
      import("@/lib/mockData/authors").then(({ getBiographiesForAuthor }) => {
        const biographies = getBiographiesForAuthor(authorId);
        setAuthorBiographies(biographies);
      });
    } else {
      setAuthorBiographies([]);
    }
  };

  // Handle adding existing author to project
  const handleAddAuthorToProject = () => {
    if (!selectedAuthor || !selectedAuthorRole) return;

    const author = allAuthors.find((a) => a.id === selectedAuthor);
    if (!author) return;

    const biography = authorBiographies.find((b) => b.id === selectedBiography);

    const newProjectAuthor = {
      id: `pa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      project_id: id,
      author_id: selectedAuthor,
      author_role: selectedAuthorRole,
      biography_id: selectedBiography || null,
      display_order: authors.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      authors: author,
      author_biographies: biography || null,
    };

    setAuthors((prev) => [...prev, newProjectAuthor]);

    // Reset form
    setSelectedAuthor("");
    setSelectedAuthorRole("Autor");
    setSelectedBiography("");
    setAuthorBiographies([]);
    setIsAuthorDialogOpen(false);
  };

  // Handle creating new author
  const handleAuthorCreated = (authorData: any) => {
    const { author, biographies } = authorData;

    // Add to all authors list
    setAllAuthors((prev) => [...prev, author]);

    // Create project author relationship with first biography
    const firstBiography = biographies[0];
    const newProjectAuthor = {
      id: `pa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      project_id: id,
      author_id: author.id,
      author_role: "Autor",
      biography_id: firstBiography?.id || null,
      display_order: authors.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      authors: author,
      author_biographies: firstBiography || null,
    };

    setAuthors((prev) => [...prev, newProjectAuthor]);
  };

  if (loading) {
    return (
      <Layout title="Projekt wird geladen...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Projekt wird geladen... ID: {id}</p>
            <p className="text-sm text-gray-500 mt-2">
              Debug: Loading state is {loading ? "true" : "false"}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout title="Fehler">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold mb-2">
            Fehler beim Laden des Projekts
          </h2>
          <p className="text-red-500">{error || "Projekt nicht gefunden"}</p>
          <p className="mt-2">Projekt-ID: {id}</p>
          <p className="text-sm text-gray-500 mt-1">
            Debug: Project is {project ? "loaded" : "null"}, Error:{" "}
            {error || "none"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Loading: {loading ? "true" : "false"}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Neu laden
          </button>
        </div>
      </Layout>
    );
  }

  // Version tabs and comparison button component
  const VersionTabsSection = () => (
    <div className="bg-gray-100 border-gray-200 shadow-sm mb-6 py-3">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex-1 max-w-md">
            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-1">
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setActiveTab("editing")}
                  className={`px-4 py-2 text-center rounded-md transition-colors ${activeTab === "editing" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted/50"}`}
                >
                  Version in Bearbeitung
                </button>
                <button
                  onClick={() => setActiveTab("published")}
                  className={`px-4 py-2 text-center rounded-md transition-colors ${activeTab === "published" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted/50"}`}
                >
                  Veröffentlichte Version
                </button>
              </div>
            </div>
          </div>

          <Button
            variant={isCompareMode ? "secondary" : "outline"}
            className="ml-4 shadow-sm"
            onClick={() => setIsCompareMode(!isCompareMode)}
            disabled={!publishedProject}
          >
            <CompareIcon className="h-4 w-4 mr-2" />
            {isCompareMode ? "Vergleich beenden" : "Änderungen anzeigen"}
          </Button>
        </div>
      </div>
    </div>
  );

  const breadcrumbs = [
    { label: "Buchmanagement", href: "/buchmanagement" },
    { label: project?.title || "Projekt" },
  ];

  const currentStep = tourSteps[tourStep];

  return (
    <Layout title="" breadcrumbs={breadcrumbs}>
      {/* Tour Overlay */}
      {showTour && (
        <>
          {/* Dimming overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-60 z-40" />

          {/* Spotlight effect for target element */}
          {currentStep.target && (
            <div
              className="fixed z-45 pointer-events-none"
              style={{
                boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6)`,
                ...getTargetElementPosition(currentStep.target),
              }}
            />
          )}

          {/* Tour dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative pointer-events-auto shadow-2xl">
              <button
                onClick={closeTour}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
              >
                <XIcon className="h-4 w-4" />
              </button>
              <h3 className="text-lg font-semibold mb-3">
                {currentStep.title}
              </h3>
              <p className="text-gray-600 mb-4">{currentStep.content}</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  {tourSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === tourStep ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={closeTour}>
                    Überspringen
                  </Button>
                  <Button onClick={nextTourStep}>
                    {tourStep < tourSteps.length - 1 ? "Weiter" : "Fertig"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {hasPublishedEditions && <VersionTabsSection />}
      <div className="max-w-full mx-auto px-4">
        <ProjectHeader
          project={{
            ...(activeTab === "published" && publishedProject
              ? publishedProject
              : project),
            authors,
            editions,
          }}
          projectAuthors={authors}
          seriesList={[]}
          isEditing={isEditing && activeTab === "editing"}
          isProjectDetailsComplete={isProjectDetailsComplete}
          isProjectReadyForPublishing={isProjectReadyForPublishing}
          handleEditToggle={() => {
            if (activeTab === "published") {
              // Switch to editing tab first if trying to edit from published view
              setActiveTab("editing");
              // Use a shorter timeout to make the transition feel more responsive
              setTimeout(() => {
                console.log("Executing delayed handleEditToggle");
                setIsEditing(true);
              }, 50);
            } else {
              handleEditToggle();
            }
          }}
          onSave={handleSaveChanges}
          onCancel={handleCancelEdit}
          setIsPublishingModalOpen={setIsPublishingModalOpen}
          id={id}
          onProjectUpdate={(updatedProject) => {
            setProject(updatedProject);
            // Update editedProject as well
            const updatedEditedProject = {
              ...updatedProject,
              targetAudience: updatedProject.target_audience,
              targetAudienceGroups: updatedProject.target_audience_groups,
              sellingPoints: updatedProject.selling_points,
            };
            setEditedProject(updatedEditedProject);
          }}
          genreOptions={[
            {
              id: "fiction",
              name: "Belletristik",
              children: [
                {
                  id: "fiction.literary",
                  name: "Literarische Belletristik",
                },
                { id: "fiction.thriller", name: "Thriller" },
                { id: "fiction.mystery", name: "Krimi" },
                { id: "fiction.romance", name: "Liebesroman" },
                { id: "fiction.fantasy", name: "Fantasy" },
                { id: "fiction.scifi", name: "Science Fiction" },
              ],
            },
            {
              id: "non-fiction",
              name: "Sachbuch",
              children: [
                { id: "non-fiction.biography", name: "Biografie" },
                { id: "non-fiction.history", name: "Geschichte" },
                { id: "non-fiction.science", name: "Wissenschaft" },
                { id: "non-fiction.business", name: "Wirtschaft" },
                { id: "non-fiction.writing", name: "Schreiben" },
                { id: "non-fiction.marketing", name: "Marketing" },
              ],
            },
          ]}
        />
        {isCompareMode && (
          <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg overflow-y-auto z-10 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Änderungen</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCompareMode(false)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>

            {getProjectDifferences().length === 0 ? (
              <p className="text-gray-500 italic">Keine Änderungen gefunden</p>
            ) : (
              <div className="space-y-4">
                {getProjectDifferences().map((diff, index) => (
                  <div key={index} className="border-b pb-3">
                    <h4 className="font-medium text-sm">{diff.field}</h4>
                    <div className="mt-1 text-sm bg-red-50 p-2 rounded">
                      <span className="line-through">{diff.oldValue}</span>
                    </div>
                    <div className="mt-1 text-sm bg-green-50 p-2 rounded">
                      <span>{diff.newValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className={isCompareMode ? "mr-80" : ""}>
          {activeTab === "editing" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <ProjectCover
                  project={project}
                  editions={editions}
                  isEditing={isEditing}
                  editedProject={editedProject || project}
                  setEditedProject={setEditedProject}
                  isProjectReadyForPublishing={isProjectReadyForPublishing}
                  setIsAddEditionDialogOpen={setIsAddEditionDialogOpen}
                  setEditions={setEditions}
                />
              </div>
              <div className="md:col-span-2">
                <div data-tour-target="editions-section">
                  {/* Edition Tabs Section */}
                  <div className="w-full mb-8">
                    {editions.length === 0 ? (
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                              <BookOpenIcon className="h-6 w-6 mr-3 text-blue-600" />
                              Ausgaben
                            </h2>
                          </div>
                          <div className="grid grid-cols-2 gap-2 h-auto bg-gray-50 rounded-lg p-1">
                            <button
                              onClick={() => setIsAddEditionDialogOpen(true)}
                              className="flex flex-col items-center p-4 h-auto min-h-[120px] border border-dashed border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <div className="flex flex-col items-center justify-center h-full space-y-2">
                                <div className="text-green-400">
                                  <PlusCircleIcon className="h-6 w-6" />
                                </div>
                                <div className="text-center text-sm text-green-400 font-medium">
                                  Erste Ausgabe anlegen
                                </div>
                              </div>
                            </button>
                            <div className="flex flex-col items-center p-4 h-auto min-h-[120px] border border-gray-200 rounded-lg bg-gray-50 opacity-30">
                              <div className="flex flex-col items-center justify-center h-full space-y-2">
                                <div className="text-gray-400">
                                  <PlusCircleIcon className="h-6 w-6" />
                                </div>
                                <div className="text-center text-xs text-gray-400">
                                  Weitere Ausgabe
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                              <BookOpenIcon className="h-6 w-6 mr-3 text-blue-600" />
                              Ausgaben
                            </CardTitle>
                          </div>
                          <Tabs
                            value={activeEditionTab}
                            onValueChange={setActiveEditionTab}
                            className="w-full"
                          >
                            <TabsList
                              className="grid gap-2 h-auto bg-gray-50 rounded-lg"
                              style={{
                                gridTemplateColumns: `repeat(${Math.min(editions.length + 1, 5)}, 1fr)`,
                              }}
                            >
                              {editions.map((edition, index) => {
                                const statusInfo = getStatusInfo(edition);
                                const isActive =
                                  activeEditionTab === edition.id;

                                return (
                                  <TabsTrigger
                                    key={edition.id}
                                    value={edition.id}
                                    className={`flex flex-col items-center p-4 h-auto min-h-[120px] data-[state=active]:bg-white data-[state=active]:shadow-sm border border-gray-300 data-[state=active]:border-green-500 data-[state=active]:border-1 data-[state=inactive]:bg-gray-100 data-[state=inactive]:hover:bg-gray-200 rounded-lg transition-colors`}
                                  >
                                    <div className="flex flex-col items-center justify-between h-full space-y-2">
                                      <div className="text-gray-600">
                                        {getProductFormIcon(
                                          edition.produktform,
                                        )}
                                      </div>
                                      <div className="text-center flex-1 flex flex-col justify-center">
                                        <div className="font-medium text-sm">
                                          {edition.produktform}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 min-h-[16px]">
                                          {edition.ausgabenart || ""}
                                        </div>
                                      </div>
                                      <div
                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                                      >
                                        {statusInfo.icon}
                                        {statusInfo.text}
                                      </div>
                                    </div>
                                  </TabsTrigger>
                                );
                              })}
                              {/* Add Edition Tab Tile */}
                              <TabsTrigger
                                value="add-edition"
                                className="flex flex-col items-center p-4 h-auto min-h-[120px] border border-dashed border-green-300 bg-white hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                onClick={() => setIsAddEditionDialogOpen(true)}
                              >
                                <div className="flex flex-col items-center justify-center h-full space-y-2">
                                  <div className="text-black">
                                    <PlusCircleIcon className="h-6 w-6" />
                                  </div>
                                  <div className="text-center text-sm text-black font-normal">
                                    Neue Ausgabe
                                  </div>
                                  <div className="text-center text-sm text-black font-normal">
                                    hinzufügen
                                  </div>
                                </div>
                              </TabsTrigger>
                            </TabsList>

                            {editions.map((edition) => (
                              <TabsContent
                                key={edition.id}
                                value={edition.id}
                                className="mt-2"
                              >
                                <div className="bg-white border border-gray-200 border-t-green-500 border-t-1 rounded-lg rounded-t-none shadow-sm overflow-hidden">
                                  <div className="p-4 border-b bg-white flex justify-between items-center">
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <h3 className="text-base font-medium">
                                            {edition.produktform}
                                          </h3>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                          <span>
                                            {edition.ausgabenart ||
                                              "Standardausgabe"}
                                          </span>
                                          {edition.isbn && (
                                            <span className="flex items-center gap-2">
                                              <span className="text-gray-400">
                                                •
                                              </span>
                                              <span>ISBN: {edition.isbn}</span>
                                            </span>
                                          )}
                                          {!edition.isbn && (
                                            <span className="flex items-center gap-1">
                                              <span className="text-gray-400">
                                                •
                                              </span>
                                              <span className="italic">
                                                Keine ISBN
                                              </span>
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-red-500 text-red-500 hover:bg-red-50"
                                          >
                                            <TrashIcon className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>

                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            window.location.href = `/edition/${edition.id}`;
                                          }}
                                        >
                                          <EditIcon className="h-4 w-4 mr-1" />
                                          Bearbeiten
                                        </Button>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Ausgabe löschen
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Möchten Sie die Ausgabe "
                                              {edition.produktform}" wirklich
                                              löschen? Diese Aktion kann nicht
                                              rückgängig gemacht werden.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              Abbrechen
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={async () => {
                                                try {
                                                  // Remove edition from local state
                                                  setEditions(
                                                    editions.filter(
                                                      (e) =>
                                                        e.id !== edition.id,
                                                    ),
                                                  );

                                                  toast({
                                                    title: "Erfolg",
                                                    description:
                                                      "Die Ausgabe wurde erfolgreich gelöscht.",
                                                  });
                                                } catch (error) {
                                                  console.error(
                                                    "Error deleting edition:",
                                                    error,
                                                  );
                                                  toast({
                                                    title: "Fehler",
                                                    description:
                                                      "Die Ausgabe konnte nicht gelöscht werden.",
                                                    variant: "destructive",
                                                  });
                                                }
                                              }}
                                              className="bg-red-500 hover:bg-red-600 text-white"
                                            >
                                              Löschen
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </div>

                                  <div className="p-4">
                                    <div className="space-y-4">
                                      <div className="flex justify-between items-center">
                                        {edition.pages && edition.pages > 0 && (
                                          <div className="text-sm text-gray-500">
                                            {edition.pages} Seiten
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex flex-wrap mt-4 items-center justify-between">
                                        <div className="flex flex-wrap gap-1">
                                          <a
                                            href={`/edition/${edition.id}?tab=format`}
                                            className={`px-3 py-1 rounded-md ${edition.format_complete ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"} cursor-pointer hover:opacity-90`}
                                          >
                                            <span className="text-xs font-medium flex items-center">
                                              {edition.format_complete ? (
                                                <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                                              ) : (
                                                <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                                              )}
                                              Format
                                            </span>
                                          </a>
                                          <a
                                            href={`/edition/${edition.id}?tab=content`}
                                            className={`px-3 py-1 rounded-md ${edition.content_complete ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"} cursor-pointer hover:opacity-90`}
                                          >
                                            <span className="text-xs font-medium flex items-center">
                                              {edition.content_complete ? (
                                                <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                                              ) : (
                                                <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                                              )}
                                              Inhalt
                                            </span>
                                          </a>
                                          <a
                                            href={`/edition/${edition.id}?tab=cover`}
                                            className={`px-3 py-1 rounded-md ${edition.cover_complete ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"} cursor-pointer hover:opacity-90`}
                                          >
                                            <span className="text-xs font-medium flex items-center">
                                              {edition.cover_complete ? (
                                                <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                                              ) : (
                                                <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                                              )}
                                              Cover
                                            </span>
                                          </a>
                                          <a
                                            href={`/edition/${edition.id}?tab=pricing`}
                                            className={`px-3 py-1 rounded-md ${edition.pricing_complete ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"} cursor-pointer hover:opacity-90`}
                                          >
                                            <span className="text-xs font-medium flex items-center">
                                              {edition.pricing_complete ? (
                                                <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                                              ) : (
                                                <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                                              )}
                                              Preis
                                            </span>
                                          </a>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-sm text-gray-500">
                                            Preis
                                          </div>
                                          <div className="font-bold text-lg">
                                            {edition.price
                                              ? `${edition.price.toFixed(2)} €`
                                              : "--,-- €"}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                            ))}
                          </Tabs>
                        </CardContent>
                      </Card>
                    )}
                    <div className="border-b pb-4 mt-8"></div>
                  </div>
                </div>
                <div className={isCompareMode ? "relative" : ""}>
                  {isCompareMode && (
                    <div className="absolute inset-0 bg-yellow-50 bg-opacity-30 pointer-events-none z-10"></div>
                  )}
                  <ProjectDetails
                    project={project}
                    projectAuthors={authors}
                    isEditing={isEditing}
                    editedProject={editedProject}
                    onInputChange={handleInputChange}
                    onSelectChange={handleSelectChange}
                    onSave={handleSaveChanges}
                    onCancel={handleCancelEdit}
                    seriesList={[]}
                    genreOptions={[
                      {
                        id: "fiction",
                        name: "Belletristik",
                        children: [
                          {
                            id: "fiction.literary",
                            name: "Literarische Belletristik",
                          },
                          { id: "fiction.thriller", name: "Thriller" },
                          { id: "fiction.mystery", name: "Krimi" },
                          { id: "fiction.romance", name: "Liebesroman" },
                          { id: "fiction.fantasy", name: "Fantasy" },
                          { id: "fiction.scifi", name: "Science Fiction" },
                        ],
                      },
                      {
                        id: "non-fiction",
                        name: "Sachbuch",
                        children: [
                          { id: "non-fiction.biography", name: "Biografie" },
                          { id: "non-fiction.history", name: "Geschichte" },
                          { id: "non-fiction.science", name: "Wissenschaft" },
                          { id: "non-fiction.business", name: "Wirtschaft" },
                          { id: "non-fiction.writing", name: "Schreiben" },
                          { id: "non-fiction.marketing", name: "Marketing" },
                        ],
                      },
                    ]}
                    reorderingAuthors={reorderingAuthors}
                    setReorderingAuthors={setReorderingAuthors}
                    handleRemoveAuthorFromProject={(authorId) => {
                      console.log("Removing author with ID:", authorId);
                      setAuthors(authors.filter((a) => a.id !== authorId));
                    }}
                    setIsAuthorDialogOpen={setIsAuthorDialogOpen}
                    setIsNewAuthorDialogOpen={setIsNewAuthorDialogOpen}
                    setIsNewSeriesDialogOpen={(isOpen) => {
                      console.log("Setting new series dialog open:", isOpen);
                      if (isOpen) {
                        alert(
                          "Funktion zum Erstellen neuer Buchreihen wird implementiert",
                        );
                      }
                    }}
                    handleEditToggle={handleEditToggle}
                    allAuthors={allAuthors}
                    authorBiographies={authorBiographies}
                    selectedAuthor={selectedAuthor}
                    selectedAuthorRole={selectedAuthorRole}
                    selectedBiography={selectedBiography}
                    handleAuthorChange={handleAuthorChange}
                    setSelectedAuthorRole={setSelectedAuthorRole}
                    setSelectedBiography={setSelectedBiography}
                    handleAddAuthorToProject={handleAddAuthorToProject}
                    handleAuthorCreated={handleAuthorCreated}
                  />
                </div>
              </div>
            </div>
          ) : (
            // Published version (always read-only)
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <ProjectCover
                  project={publishedProject}
                  editions={editions}
                  isEditing={false}
                  editedProject={publishedProject}
                  setEditedProject={() => {}}
                  isProjectReadyForPublishing={() => true}
                  setIsAddEditionDialogOpen={() => {}}
                  setEditions={() => {}}
                />
              </div>
              <div className="md:col-span-2">
                <div className="border-2 border-blue-300 rounded-lg p-4 mb-6 bg-blue-50 shadow-sm">
                  <p className="text-blue-700 font-medium flex items-center">
                    <svg
                      xmlns="http://www3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Dies ist die veröffentlichte Version des Projekts.
                    Änderungen können nur in der "Version in Bearbeitung"
                    vorgenommen werden.
                  </p>
                </div>
                {/* Published Edition Tabs Section - Read Only */}
                <div className="w-full mb-8">
                  {editions.length === 0 ? (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <BookOpenIcon className="h-6 w-6 mr-3 text-blue-600" />
                            Ausgaben
                          </h2>
                        </div>
                        <div className="grid grid-cols-2 gap-2 h-auto bg-gray-50 rounded-lg p-1">
                          <div className="flex flex-col items-center p-4 h-auto min-h-[120px] border border-dashed border-gray-300 rounded-lg bg-white opacity-50">
                            <div className="flex flex-col items-center justify-center h-full space-y-2">
                              <div className="text-gray-400">
                                <PlusCircleIcon className="h-6 w-6" />
                              </div>
                              <div className="text-center text-sm text-gray-400">
                                Erste Ausgabe anlegen
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-center p-4 h-auto min-h-[120px] border border-gray-200 rounded-lg bg-gray-50 opacity-30">
                            <div className="flex flex-col items-center justify-center h-full space-y-2">
                              <div className="text-gray-400">
                                <PlusCircleIcon className="h-6 w-6" />
                              </div>
                              <div className="text-center text-xs text-gray-400">
                                Weitere Ausgabe
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <BookOpenIcon className="h-6 w-6 mr-3 text-blue-600" />
                            Ausgaben
                          </h2>
                        </div>
                        <Tabs
                          value={activeEditionTab}
                          onValueChange={setActiveEditionTab}
                          className="w-full"
                        >
                          <TabsList
                            className="grid gap-2 h-auto bg-gray-50 rounded-lg"
                            style={{
                              gridTemplateColumns:
                                editions.length === 1
                                  ? "1fr 1fr"
                                  : `repeat(${Math.min(editions.length, 4)}, 1fr)`,
                            }}
                          >
                            {editions.map((edition, index) => {
                              const statusInfo = getStatusInfo(edition);
                              const isActive = activeEditionTab === edition.id;
                              // Only show the first edition if there's only one, or show all if there are multiple
                              if (editions.length === 1 && index > 0)
                                return null;

                              return (
                                <TabsTrigger
                                  key={edition.id}
                                  value={edition.id}
                                  className={`flex flex-col items-center p-4 h-auto min-h-[120px] data-[state=active]:bg-white data-[state=active]:shadow-sm border border-gray-300 data-[state=active]:border-green-500 data-[state=active]:border-2 data-[state=inactive]:bg-gray-100 data-[state=inactive]:hover:bg-gray-200 rounded-lg transition-colors ${
                                    editions.length === 1 ? "col-span-1" : ""
                                  } ${
                                    isActive ? "rounded-b-none border-b-0" : ""
                                  }`}
                                >
                                  <div className="flex flex-col items-center justify-between h-full space-y-2">
                                    <div className="text-gray-600">
                                      {getProductFormIcon(edition.produktform)}
                                    </div>
                                    <div className="text-center flex-1 flex flex-col justify-center">
                                      <div className="font-medium text-sm">
                                        {edition.produktform}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1 min-h-[16px]">
                                        {edition.ausgabenart || ""}
                                      </div>
                                    </div>
                                    <div
                                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                                    >
                                      {statusInfo.icon}
                                      {statusInfo.text}
                                    </div>
                                  </div>
                                </TabsTrigger>
                              );
                            })}
                            {/* Non-clickable placeholder for published version */}
                            {editions.length === 1 && (
                              <div className="flex flex-col items-center p-4 h-auto min-h-[120px] border border-gray-200 rounded-lg bg-gray-50 opacity-30">
                                <div className="flex flex-col items-center justify-center h-full space-y-2">
                                  <div className="text-gray-400">
                                    <PlusCircleIcon className="h-6 w-6" />
                                  </div>
                                  <div className="text-center text-xs text-gray-400">
                                    Weitere Ausgabe
                                  </div>
                                </div>
                              </div>
                            )}
                          </TabsList>

                          {editions.map((edition) => (
                            <TabsContent
                              key={edition.id}
                              value={edition.id}
                              className="mt-0"
                            >
                              <div className="bg-white border border-gray-200 border-t-green-500 border-t-2 rounded-lg rounded-t-none shadow-sm overflow-hidden">
                                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h3 className="text-base font-medium">
                                          {edition.produktform}
                                        </h3>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>
                                          {edition.ausgabenart ||
                                            "Standardausgabe"}
                                        </span>
                                        {edition.isbn && (
                                          <span className="flex items-center gap-2">
                                            <span className="text-gray-400">
                                              •
                                            </span>
                                            <span>ISBN: {edition.isbn}</span>
                                          </span>
                                        )}
                                        {!edition.isbn && (
                                          <span className="flex items-center gap-1">
                                            <span className="text-gray-400">
                                              •
                                            </span>
                                            <span className="italic">
                                              Keine ISBN
                                            </span>
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-4">
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                      {edition.pages && edition.pages > 0 && (
                                        <div className="text-sm text-gray-500">
                                          {edition.pages} Seiten
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex flex-wrap mt-4 items-center justify-between">
                                      <div className="flex flex-wrap gap-1">
                                        <div
                                          className={`px-3 py-1 rounded-md ${edition.format_complete ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}
                                        >
                                          <span className="text-xs font-medium flex items-center">
                                            {edition.format_complete ? (
                                              <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                                            ) : (
                                              <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                                            )}
                                            Format
                                          </span>
                                        </div>
                                        <div
                                          className={`px-3 py-1 rounded-md ${edition.content_complete ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}
                                        >
                                          <span className="text-xs font-medium flex items-center">
                                            {edition.content_complete ? (
                                              <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                                            ) : (
                                              <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                                            )}
                                            Inhalt
                                          </span>
                                        </div>
                                        <div
                                          className={`px-3 py-1 rounded-md ${edition.cover_complete ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}
                                        >
                                          <span className="text-xs font-medium flex items-center">
                                            {edition.cover_complete ? (
                                              <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                                            ) : (
                                              <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                                            )}
                                            Cover
                                          </span>
                                        </div>
                                        <div
                                          className={`px-3 py-1 rounded-md ${edition.pricing_complete ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}
                                        >
                                          <span className="text-xs font-medium flex items-center">
                                            {edition.pricing_complete ? (
                                              <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                                            ) : (
                                              <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                                            )}
                                            Preis
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm text-gray-500">
                                          Preis
                                        </div>
                                        <div className="font-bold text-lg">
                                          {edition.price
                                            ? `${edition.price.toFixed(2)} €`
                                            : "--,-- €"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </CardContent>
                    </Card>
                  )}
                  <div className="border-b pb-4 mt-8"></div>
                </div>
                <div className={isCompareMode ? "relative" : ""}>
                  {isCompareMode && (
                    <div className="absolute inset-0 bg-blue-50 bg-opacity-30 pointer-events-none z-10"></div>
                  )}
                  <ProjectDetails
                    project={publishedProject}
                    projectAuthors={authors}
                    isEditing={false}
                    handleEditToggle={() => {}}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <AddEditionDialog
          isOpen={isAddEditionDialogOpen}
          onOpenChange={setIsAddEditionDialogOpen}
          editions={editions}
          projectId={id || ""}
          setEditions={setEditions}
        />
        <AddAuthorDialog
          isOpen={isAuthorDialogOpen}
          onOpenChange={setIsAuthorDialogOpen}
          authors={allAuthors}
          selectedAuthor={selectedAuthor}
          selectedAuthorRole={selectedAuthorRole}
          selectedBiography={selectedBiography}
          authorBiographies={authorBiographies}
          handleAuthorChange={handleAuthorChange}
          setSelectedAuthorRole={setSelectedAuthorRole}
          setSelectedBiography={setSelectedBiography}
          handleAddAuthorToProject={handleAddAuthorToProject}
        />
        <NewAuthorDialog
          isOpen={isNewAuthorDialogOpen}
          onOpenChange={setIsNewAuthorDialogOpen}
          onAuthorCreated={handleAuthorCreated}
        />
        {/* Last Edited Information */}
      </div>
      {/* Bottom spacing to prevent sticky bar overlap */}
      <div className="h-20"></div>
      {/* Sticky Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Left side - Project Delete Button */}
            <div className="flex-shrink-0">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    size="sm"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Projekt löschen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Projekt löschen</AlertDialogTitle>
                    <AlertDialogDescription>
                      Möchten Sie dieses Projekt wirklich löschen? Diese Aktion
                      kann nicht rückgängig gemacht werden. Alle zugehörigen
                      Ausgaben und Autorenzuweisungen werden ebenfalls gelöscht.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        try {
                          // Use the deleteProject function from the API library
                          const { deleteProject } = await import(
                            "@/lib/api/projects"
                          );
                          const { error } = await deleteProject(id as string);

                          if (error) {
                            console.error("Error deleting project:", error);
                            toast({
                              title: "Fehler",
                              description:
                                "Das Projekt konnte nicht gelöscht werden.",
                              variant: "destructive",
                            });
                            return;
                          }

                          toast({
                            title: "Erfolg",
                            description:
                              "Das Projekt wurde erfolgreich gelöscht.",
                          });

                          // Redirect to projects list
                          window.location.href = "/";
                        } catch (error) {
                          console.error("Error deleting project:", error);
                          toast({
                            title: "Fehler",
                            description:
                              "Das Projekt konnte nicht gelöscht werden.",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Löschen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Right side - Status and Publish Button */}
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <div className="flex-shrink-0">
                {isProjectReadyForPublishing() ? (
                  <Badge className="bg-green-600 text-white flex items-center rounded-full whitespace-nowrap">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Bereit zur Veröffentlichung
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 border border-amber-200 flex items-center whitespace-nowrap"
                  >
                    <AlertCircleIcon className="h-4 w-4 mr-1" />
                    In Bearbeitung
                  </Badge>
                )}
              </div>

              {/* Publish Button */}
              <Button
                data-tour-target="publish-button"
                disabled={!isProjectReadyForPublishing()}
                className={
                  !isProjectReadyForPublishing()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
                onClick={() => {
                  setIsPublishingModalOpen(true);
                }}
                size="sm"
              >
                Veröffentlichen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;
