import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import ProjectHeader from "@/components/Project/ProjectHeader";
import ProjectCover from "@/components/Project/ProjectCover";
import ProjectDetails from "@/components/Project/ProjectDetails";
import ProjectEditForm from "@/components/Project/ProjectEditForm";

import AddEditionDialog from "@/components/Project/dialogs/AddEditionDialog";
import AddAuthorDialog from "@/components/Project/dialogs/AddAuthorDialog";
import NewAuthorDialog from "@/components/Project/dialogs/NewAuthorDialog";
import ProjectTour from "@/components/Project/ProjectTour";
import VersionTabs from "@/components/Project/VersionTabs";
import ComparisonSidebar from "@/components/Project/ComparisonSidebar";
import EditionTabsSection from "@/components/Project/EditionTabsSection";
import StickyFooter from "@/components/Project/StickyFooter";
import PublishedOnlyNotice from "@/components/Project/PublishedOnlyNotice";
import { fetchProjectById } from "@/lib/api/projects";
import { supabase } from "@/lib/supabase";

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
  const [searchParams, setSearchParams] = useSearchParams();
  console.log("Extracted ID from route params:", id);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [allAuthors, setAllAuthors] = useState<any[]>([]);

  // Load all authors from mock data on component mount
  useEffect(() => {
    import("@/lib/mockData/authors").then(({ mockAuthors }) => {
      setAllAuthors(mockAuthors);
    });
  }, []);
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

  // State for accordion opening
  const [openAccordion, setOpenAccordion] = useState<string>("");

  // Check if tour should start on this page and handle accordion opening
  useEffect(() => {
    const startTour = searchParams.get("startTour");
    const openAccordionParam = searchParams.get("openAccordion");
    const hasSeenTour = localStorage.getItem(`hasSeenTour_${id}`);

    // Handle accordion opening
    if (openAccordionParam) {
      setOpenAccordion(openAccordionParam);
      // Remove the parameter from URL after setting state
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("openAccordion");
      setSearchParams(newSearchParams, { replace: true });
    }

    // Start tour automatically for new projects (frontend- prefix) or when startTour=true
    if (
      (startTour === "true" || (id && id.startsWith("frontend-"))) &&
      !hasSeenTour &&
      project
    ) {
      setShowTour(true);
      // Remove the parameter from URL if it exists
      if (startTour === "true") {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("startTour");
        setSearchParams(newSearchParams, { replace: true });
      }
    }
  }, [id, project, searchParams, setSearchParams]);

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
                  status: "Veröffentlicht",
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
                  id: "pa-1-1",
                  project_id: projectId,
                  author_id: "author-1", // Maria Schmidt
                  author_role: "Hauptautor",
                  biography_id: "bio-author-1-1",
                  display_order: 0,
                  created_at: "2024-01-15T10:00:00Z",
                  updated_at: "2024-01-15T10:00:00Z",
                  authors: {
                    id: "author-1",
                    first_name: "Maria",
                    last_name: "Schmidt",
                    author_type: "person",
                    is_pseudonym: false,
                    birth_date: "1975-03-15",
                    profession: "Schriftstellerin und Schreibcoach",
                    website: "https://maria-schmidt-autorin.de",
                  },
                  author_biographies: {
                    id: "bio-author-1-1",
                    author_id: "author-1",
                    biography_text:
                      "Maria Schmidt ist eine erfahrene Autorin und Schreibcoach mit über 15 Jahren Erfahrung in der Verlagsbranche. Sie hat bereits mehrere erfolgreiche Ratgeber veröffentlicht und gibt regelmäßig Workshops für angehende Autoren.",
                    biography_label: "Standard",
                    language: "de",
                  },
                },
                {
                  id: "pa-1-2",
                  project_id: projectId,
                  author_id: "author-2", // Thomas Weber
                  author_role: "Co-Autor",
                  biography_id: "bio-author-2-1",
                  display_order: 1,
                  created_at: "2024-01-16T09:30:00Z",
                  updated_at: "2024-01-16T09:30:00Z",
                  authors: {
                    id: "author-2",
                    first_name: "Thomas",
                    last_name: "Weber",
                    author_type: "person",
                    is_pseudonym: false,
                    birth_date: "1968-11-22",
                    profession: "Lektor und Autor",
                    website: "https://thomas-weber-lektor.com",
                  },
                  author_biographies: {
                    id: "bio-author-2-1",
                    author_id: "author-2",
                    biography_text:
                      "Thomas Weber hat als Lektor bei mehreren großen Verlagen gearbeitet und teilt sein Wissen über den Publikationsprozess. Seine Expertise umfasst sowohl die redaktionelle Bearbeitung als auch die strategische Buchvermarktung.",
                    biography_label: "Standard",
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
                series: "series-1",
                publisher: "Eigenverlag Premium",
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
              editions: [],
              authors: [
                {
                  id: "pa-2-1",
                  project_id: projectId,
                  author_id: "author-11", // Elena Richter
                  author_role: "Hauptautor",
                  biography_id: "bio-author-11-1",
                  display_order: 0,
                  created_at: "2024-02-05T10:30:00Z",
                  updated_at: "2024-02-05T10:30:00Z",
                  authors: {
                    id: "author-11",
                    first_name: "Elena",
                    last_name: "Richter",
                    author_type: "person",
                    is_pseudonym: false,
                    birth_date: "1987-08-25",
                    profession: "Schreibtrainerin und Autorin",
                    website: "https://elena-richter-schreibtraining.de",
                  },
                  author_biographies: {
                    id: "bio-author-11-1",
                    author_id: "author-11",
                    biography_text:
                      "Elena Richter ist eine erfahrene Schreibtrainerin und Autorin, die sich auf kreatives Schreiben und Storytelling spezialisiert hat. Sie leitet Workshops für angehende Autoren und hat bereits mehrere erfolgreiche Ratgeber zum Thema Schreiben veröffentlicht.",
                    biography_label: "Standard",
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
                series: "series-2",
                publisher: "Kreativ Verlag",
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
                  status: "In Bearbeitung",
                  isbn: "978-3-987654-36-9",
                  cover_image:
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
                  is_complete: false,
                  format_complete: true,
                  content_complete: false,
                  cover_complete: true,
                  pricing_complete: true,
                  authors_complete: true,
                },
              ],
              authors: [
                {
                  id: "pa-3-1",
                  project_id: projectId,
                  author_id: "author-12", // Dr. Marcus Bauer
                  author_role: "Hauptautor",
                  biography_id: "bio-author-12-1",
                  display_order: 0,
                  created_at: "2024-02-06T14:15:00Z",
                  updated_at: "2024-02-06T14:15:00Z",
                  authors: {
                    id: "author-12",
                    first_name: "Dr. Marcus",
                    last_name: "Bauer",
                    author_type: "person",
                    is_pseudonym: false,
                    birth_date: "1972-11-14",
                    profession: "Literaturwissenschaftler und Autor",
                    website: "https://dr-marcus-bauer.de",
                  },
                  author_biographies: {
                    id: "bio-author-12-1",
                    author_id: "author-12",
                    biography_text:
                      "Dr. Marcus Bauer ist Literaturwissenschaftler an der Universität München und Experte für moderne deutsche Literatur. Er verbindet wissenschaftliche Expertise mit praktischen Schreibtechniken und hat bereits mehrere Fachbücher über Literaturanalyse und Schreibmethoden veröffentlicht.",
                    biography_label: "Standard",
                    language: "de",
                  },
                },
                {
                  id: "pa-3-2",
                  project_id: projectId,
                  author_id: "author-6", // Sarah Klein (Illustratorin)
                  author_role: "Illustrator",
                  biography_id: "bio-author-6-1",
                  display_order: 1,
                  created_at: "2024-01-20T13:15:00Z",
                  updated_at: "2024-01-20T13:15:00Z",
                  authors: {
                    id: "author-6",
                    first_name: "Sarah",
                    last_name: "Klein",
                    author_type: "person",
                    is_pseudonym: false,
                    birth_date: "1990-12-03",
                    profession: "Illustratorin",
                    website: "https://sarah-klein-illustration.com",
                  },
                  author_biographies: {
                    id: "bio-author-6-1",
                    author_id: "author-6",
                    biography_text:
                      "Sarah Klein ist eine talentierte Illustratorin, die sich auf Kinderbuch-Illustrationen spezialisiert hat. Ihre farbenfrohen und fantasievollen Zeichnungen haben bereits viele Kinderbücher zum Leben erweckt.",
                    biography_label: "Standard",
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

  // Check if project has only published editions (no drafts/in-progress)
  const hasOnlyPublishedEditions = useMemo(() => {
    if (editions.length === 0) return false;
    const allPublished = editions.every(
      (edition) =>
        edition.status === "Veröffentlicht" || edition.status === "Im Verkauf",
    );
    console.log("hasOnlyPublishedEditions result:", allPublished);
    return allPublished;
  }, [editions]);

  // Check if project has mixed editions (both published and in-progress)
  const hasMixedEditions = useMemo(() => {
    const hasPublished = editions.some(
      (edition) =>
        edition.status === "Veröffentlicht" || edition.status === "Im Verkauf",
    );
    const hasInProgress = editions.some(
      (edition) =>
        edition.status === "In Bearbeitung" || edition.status === "Entwurf",
    );
    const result = hasPublished && hasInProgress;
    console.log("hasMixedEditions result:", result);
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

  // Handle author selection change
  const handleAuthorChange = (authorId: string) => {
    setSelectedAuthor(authorId);
    setSelectedBiography("");

    // Find biographies for the selected author
    if (authorId) {
      // Import and use mock biographies
      import("@/lib/mockData/authors").then(({ getBiographiesForAuthor }) => {
        const biographies = getBiographiesForAuthor(authorId);
        // Filter by project language
        const projectLanguage = project?.languages?.[0] || "de";
        const filteredBiographies = biographies.filter(
          (bio) => bio.language === projectLanguage,
        );
        setAuthorBiographies(filteredBiographies);
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

  // Handle unlocking project for editing (when all editions are published)
  const handleUnlockForEditing = () => {
    console.log("Unlocking project for editing");
    // Create a draft edition to enable editing mode
    const newDraftEdition = {
      id: `draft-${Date.now()}`,
      project_id: id || "",
      title: "Neue Ausgabe (Entwurf)",
      produktform: "Softcover",
      ausgabenart: "Standardausgabe",
      price: 0,
      pages: 0,
      status: "Entwurf",
      isbn: "",
      cover_image: project?.cover_image || "",
      is_complete: false,
      format_complete: false,
      content_complete: false,
      cover_complete: false,
      pricing_complete: false,
      authors_complete: false,
    };

    setEditions((prev) => [...prev, newDraftEdition]);
    setActiveEditionTab(newDraftEdition.id);
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

  const breadcrumbs = [
    { label: "Buchmanagement", href: "/buchmanagement" },
    { label: project?.title || "Projekt" },
  ];

  const currentStep = tourSteps[tourStep];

  return (
    <Layout title="" breadcrumbs={breadcrumbs}>
      <ProjectTour
        showTour={showTour}
        tourStep={tourStep}
        tourSteps={tourSteps}
        onNextStep={nextTourStep}
        onCloseTour={closeTour}
        getTargetElementPosition={getTargetElementPosition}
      />
      {hasMixedEditions && (
        <VersionTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCompareMode={isCompareMode}
          setIsCompareMode={setIsCompareMode}
          publishedProject={publishedProject}
        />
      )}
      {hasOnlyPublishedEditions && (
        <PublishedOnlyNotice onUnlockForEditing={handleUnlockForEditing} />
      )}
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
        <ComparisonSidebar
          isCompareMode={isCompareMode}
          setIsCompareMode={setIsCompareMode}
          getProjectDifferences={getProjectDifferences}
        />
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
                  <EditionTabsSection
                    editions={editions}
                    setEditions={setEditions}
                    activeEditionTab={activeEditionTab}
                    setActiveEditionTab={setActiveEditionTab}
                    setIsAddEditionDialogOpen={setIsAddEditionDialogOpen}
                    isPublishedView={false}
                  />
                  <div className="border-b pb-4 mt-8"></div>
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
                    openAccordion={openAccordion}
                    setOpenAccordion={setOpenAccordion}
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
                <EditionTabsSection
                  editions={editions}
                  setEditions={setEditions}
                  activeEditionTab={activeEditionTab}
                  setActiveEditionTab={setActiveEditionTab}
                  setIsAddEditionDialogOpen={() => {}}
                  isPublishedView={true}
                />
                <div className="border-b pb-4 mt-8"></div>
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
          projectLanguages={project?.languages || []}
        />
        <NewAuthorDialog
          isOpen={isNewAuthorDialogOpen}
          onOpenChange={setIsNewAuthorDialogOpen}
          onAuthorCreated={handleAuthorCreated}
        />
      </div>
      <StickyFooter
        isProjectReadyForPublishing={isProjectReadyForPublishing}
        setIsPublishingModalOpen={setIsPublishingModalOpen}
        projectId={id || ""}
      />
    </Layout>
  );
};

export default ProjectDetailPage;
