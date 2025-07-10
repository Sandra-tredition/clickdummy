import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertTriangle,
  Info,
  Plus,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import {
  mockAuthors,
  getBiographiesForAuthor,
  getStandardBiographyForAuthor,
  getProjectSpecificBiographiesForAuthor,
  mockProjectAssignmentsWithBio,
  getProjectAssignmentsForAuthor,
  getProjectBiographyForAuthor,
} from "@/lib/mockData/authors";

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

// Schema and types are now imported from the reusable component

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

const AuthorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBiographyTab, setActiveBiographyTab] = useState<string>("");
  const [editingBasicData, setEditingBasicData] = useState<Author | null>(null);
  const [editingStandardBiography, setEditingStandardBiography] =
    useState<boolean>(false);
  const [standardBiographyText, setStandardBiographyText] =
    useState<string>("");

  // State to track where the user came from
  const [referrerInfo, setReferrerInfo] = useState<{
    path: string;
    label: string;
  } | null>(null);

  // State to track collapsed/expanded projects - default to all collapsed
  const [collapsedProjects, setCollapsedProjects] = useState<Set<string>>(
    new Set(),
  );

  // Detect referrer on component mount
  useEffect(() => {
    // Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const fromProject = urlParams.get("from");

    if (fromProject && fromProject.startsWith("project-")) {
      // Extract project ID from the 'from' parameter
      const projectId = fromProject.replace("project-", "");
      setReferrerInfo({
        path: `/project/${projectId}`,
        label: "Zurück zum Projekt",
      });
      return;
    }

    // Check localStorage for recent navigation
    const recentNavigation = localStorage.getItem("authorPageNavigation");
    if (recentNavigation) {
      try {
        const navData = JSON.parse(recentNavigation);
        const timeDiff = Date.now() - navData.timestamp;

        // If navigation data is less than 5 seconds old, use it
        if (timeDiff < 5000 && navData.from) {
          if (navData.from.startsWith("/project/")) {
            setReferrerInfo({
              path: navData.from,
              label: "Zurück zum Projekt",
            });
            return;
          }
        }
      } catch (error) {
        console.log("Error parsing navigation data:", error);
      }
    }

    // Fallback to document.referrer as last resort
    const referrer = document.referrer;
    const referrerPath = referrer ? new URL(referrer).pathname : "";

    if (referrerPath.includes("/project/")) {
      const projectIdMatch = referrerPath.match(/\/project\/([^/?]+)/);
      if (projectIdMatch) {
        const projectId = projectIdMatch[1];
        setReferrerInfo({
          path: `/project/${projectId}`,
          label: "Zurück zum Projekt",
        });
        return;
      }
    }

    // Default fallback
    setReferrerInfo({
      path: "/buchmanagement#authors",
      label: "Zurück zur Übersicht",
    });
  }, []);

  // Load author data
  useEffect(() => {
    const loadAuthor = () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      // Check if current user is the clean user (no mock data)
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null",
      );
      const isCleanUser = currentUser?.email === "clean@example.com";

      if (isCleanUser) {
        console.log("Clean user detected - no mock authors will be shown");
        setAuthor(null);
        setIsLoading(false);
        return;
      }

      // Find author in mock data
      const foundAuthor = mockAuthors.find((a) => a.id === id);
      if (foundAuthor) {
        // Get biography count for this author
        const biographiesCount = getBiographiesForAuthor(foundAuthor.id).length;

        // Get project assignments for this author
        const projectAssignments = getProjectAssignmentsForAuthor(
          foundAuthor.id,
        );
        const projects = projectAssignments.map((assignment) => ({
          projectId: assignment.project_id,
          projectTitle: assignment.project_title,
          authorRole: assignment.author_role,
        }));

        const authorData: Author = {
          id: foundAuthor.id,
          authorType: foundAuthor.author_type,
          firstName: foundAuthor.first_name,
          lastName: foundAuthor.last_name,
          companyName: foundAuthor.company_name,
          isPseudonym: foundAuthor.is_pseudonym,
          isni: foundAuthor.isni,
          profession: foundAuthor.profession,
          company: foundAuthor.company,
          website: foundAuthor.website,
          birthDate: foundAuthor.birth_date
            ? new Date(foundAuthor.birth_date)
            : null,
          deathDate: foundAuthor.death_date
            ? new Date(foundAuthor.death_date)
            : null,
          projects: projects,
          biographiesCount: biographiesCount,
        };

        setAuthor(authorData);

        // Set initial biography tab
        const biographies = getBiographiesForAuthor(foundAuthor.id);
        if (biographies.length > 0) {
          setActiveBiographyTab(biographies[0].biography_label || "0");
        }

        // Initialize all projects as collapsed by default
        const projectIds = projects.map((p) => p.projectId);
        setCollapsedProjects(new Set(projectIds));
      }
      setIsLoading(false);
    };

    loadAuthor();
  }, [id]);

  const handleEditBasicData = (author: Author) => {
    setEditingBasicData(author);
  };

  const handleEditStandardBiography = () => {
    const standardBio = getStandardBiographyForAuthor(author?.id || "");
    if (standardBio) {
      setStandardBiographyText(standardBio.biography_text);
      setEditingStandardBiography(true);
    }
  };

  const handleSaveStandardBiography = () => {
    // In a real app, this would update the database
    console.log("Saving standard biography:", standardBiographyText);
    setEditingStandardBiography(false);
    // Show alert about impact on projects
    alert(
      "Die Standard-Biografie wurde aktualisiert. Änderungen wirken sich auf alle Projekte aus, die diese Biografie verwenden. Bei Projekten mit veröffentlichten Ausgaben wird diese Änderung in der Vergleichsansicht angezeigt.",
    );
    // Reload author data
    window.location.reload();
  };

  const handleCancelStandardBiography = () => {
    setEditingStandardBiography(false);
    setStandardBiographyText("");
  };

  const handleSaveBasicData = async (data: AuthorBasicFormValues) => {
    if (!editingBasicData) return;

    // In a real app, this would update the database
    console.log("Saving basic data:", data);
    setEditingBasicData(null);
    // Reload author data
    window.location.reload();
  };

  // Biography management functions removed - now handled in project context

  const handleDeleteAuthor = () => {
    if (!author) return;
    // In a real app, this would delete from the database
    console.log("Deleting author:", author.id);
    navigate("/buchmanagement#authors");
  };

  const handleBackNavigation = () => {
    if (referrerInfo) {
      navigate(referrerInfo.path);
    } else {
      navigate("/buchmanagement#authors");
    }
  };

  const toggleProjectCollapse = (projectId: string) => {
    setCollapsedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <Layout
        title="Urheber wird geladen..."
        breadcrumbs={[
          { label: "Buchmanagement", href: "/buchmanagement" },
          { label: "Urheber", href: "/buchmanagement#authors" },
          { label: "Wird geladen..." },
        ]}
      >
        <div className="flex justify-center py-8">
          <p>Urheber wird geladen...</p>
        </div>
      </Layout>
    );
  }

  if (!author) {
    return (
      <Layout
        title="Urheber nicht gefunden"
        breadcrumbs={[
          { label: "Buchmanagement", href: "/buchmanagement" },
          { label: "Urheber", href: "/buchmanagement#authors" },
          { label: "Nicht gefunden" },
        ]}
      >
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Urheber nicht gefunden</h2>
          <p className="text-muted-foreground mb-6">
            Der angeforderte Urheber konnte nicht gefunden werden.
          </p>
          <Button onClick={handleBackNavigation}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {referrerInfo?.label || "Zurück zur Übersicht"}
          </Button>
        </div>
      </Layout>
    );
  }

  const authorName =
    author.authorType === "person"
      ? `${author.lastName}, ${author.firstName || ""}`
      : author.companyName;

  const breadcrumbs = [
    { label: "Buchmanagement", href: "/buchmanagement" },
    { label: "Urheber", href: "/buchmanagement#authors" },
    { label: authorName || "Unbekannt" },
  ];

  return (
    <Layout title="Urheber" breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackNavigation}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {referrerInfo?.label || "Zurück zur Übersicht"}
          </Button>
        </div>

        {/* Author Detail Card - Mirroring the accordion content */}
        <Card className="w-full border-2 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl">
                  {author.authorType === "person"
                    ? `${author.lastName}, ${author.firstName || ""}`
                    : author.companyName}
                </CardTitle>
                {author.isPseudonym && (
                  <Badge variant="outline">Pseudonym</Badge>
                )}
              </div>
            </div>
          </CardHeader>
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
                      <span className="hidden sm:inline">Bearbeiten</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Standard-Biografie Section */}
              {author.authorType === "person" && (
                <div className="space-y-4">
                  <div className="relative rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                          <FileText size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Standard-Biografie</p>
                          <p className="text-sm text-gray-600">
                            Wird als Basis für neue Projekte verwendet
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditStandardBiography}
                        >
                          <Edit size={14} className="mr-1" />
                          Bearbeiten
                        </Button>
                      </div>
                    </div>
                    {(() => {
                      const standardBio = getStandardBiographyForAuthor(
                        author.id,
                      );
                      return standardBio ? (
                        <div className="ml-20 space-y-4">
                          <div className="border border-gray-300 rounded-lg bg-gray-100 p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center mb-3">
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-700 rounded-full font-normal"
                                  >
                                    {getLanguageLabel(standardBio.language)}
                                  </Badge>
                                </div>
                                <p className="text-sm leading-relaxed text-black">
                                  {standardBio.biography_text}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="ml-20">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                              Keine Standard-Biografie vorhanden
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setStandardBiographyText("");
                                setEditingStandardBiography(true);
                              }}
                            >
                              <Plus size={14} className="mr-1" />
                              Erstellen
                            </Button>
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
                          Zugeordnete Projekte ({author.projects.length})
                        </p>
                        <p className="text-sm text-gray-600">
                          Alle Projekte, in denen dieser Urheber verwendet wird
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
                              assignment.project_id === project.projectId,
                          );

                        // Get the standard biography
                        const standardBio = getStandardBiographyForAuthor(
                          author.id,
                        );

                        // Get project-specific biography
                        const projectBiography = getProjectBiographyForAuthor(
                          project.projectId,
                          author.id,
                        );

                        const isCollapsed = collapsedProjects.has(
                          project.projectId,
                        );

                        // Determine which biography is being used
                        let biographyInfo = null;
                        let biographyType = "none";

                        // Check if project assignment has a biography_id
                        const hasBiographyAssigned =
                          projectAssignmentWithBio &&
                          projectAssignmentWithBio.biography_id &&
                          projectAssignmentWithBio.biography_id.trim() !== "";

                        if (projectBiography) {
                          biographyInfo = projectBiography;
                          biographyType = "project";
                        } else if (hasBiographyAssigned && standardBio) {
                          biographyInfo = standardBio;
                          biographyType = "standard";
                        } else {
                          biographyType = "none";
                        }

                        return (
                          <div
                            key={projectIndex}
                            className="border border-gray-200 rounded-lg bg-white"
                          >
                            <div className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="flex-1">
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
                                  {biographyType === "none" && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-gray-100 text-gray-700 rounded-full font-normal"
                                    >
                                      Ohne Biografie
                                    </Badge>
                                  )}
                                  {biographyType === "standard" && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-green-100 text-green-700 rounded-full font-normal"
                                    >
                                      Standard-Biografie
                                    </Badge>
                                  )}
                                  {biographyType === "project" && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-blue-100 text-blue-700 rounded-full font-normal"
                                    >
                                      Projektbezogene Biografie
                                    </Badge>
                                  )}
                                  {biographyInfo &&
                                    biographyType === "project" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          toggleProjectCollapse(
                                            project.projectId,
                                          )
                                        }
                                        className="flex items-center gap-2 h-8 px-3"
                                      >
                                        <span className="text-sm">
                                          {isCollapsed
                                            ? "Biografie ansehen"
                                            : "Biografie ausblenden"}
                                        </span>
                                        {isCollapsed ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronUp className="h-4 w-4" />
                                        )}
                                      </Button>
                                    )}
                                </div>
                              </div>

                              {/* Show biography if exists and not collapsed */}
                              {biographyInfo && !isCollapsed && (
                                <div className="mt-3 p-3 bg-gray-100 rounded-lg border border-gray-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-700 rounded-full font-normal text-xs"
                                      >
                                        {getLanguageLabel(
                                          biographyInfo.language,
                                        )}
                                      </Badge>
                                      {biographyType === "standard" && (
                                        <Badge
                                          variant="secondary"
                                          className="bg-green-100 text-green-700 rounded-full font-normal text-xs"
                                        >
                                          Standard
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-black leading-relaxed">
                                    {biographyInfo.biography_text}
                                  </p>
                                  <div className="flex mt-2">
                                    <Link
                                      to={`/project/${project.projectId}`}
                                      className="text-sm text-black underline decoration-2 decoration-primary-green hover:decoration-4 transition-all font-medium flex items-center gap-1"
                                    >
                                      <Edit className="h-3 w-3" />
                                      Im Projekt bearbeiten
                                    </Link>
                                  </div>
                                </div>
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
                  onClick={handleDeleteAuthor}
                  className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Urheber löschen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

          {/* Impact Warning */}
          {editingBasicData &&
            editingBasicData.projects &&
            editingBasicData.projects.length > 0 && (
              <Alert variant="warning" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-amber-800">
                  <strong>Wichtiger Hinweis:</strong> Änderungen an den
                  Grunddaten wirken sich auf alle{" "}
                  {editingBasicData.projects.length} Projekte aus, in denen
                  dieser Urheber verwendet wird. Die Änderungen werden
                  automatisch in allen zugeordneten Projekten übernommen.
                </AlertDescription>
              </Alert>
            )}

          {editingBasicData && (
            <BasicDataForm
              author={editingBasicData}
              onSave={handleSaveBasicData}
              onCancel={() => setEditingBasicData(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Standard Biography Edit Modal */}
      <Dialog
        open={editingStandardBiography}
        onOpenChange={(open) => !open && handleCancelStandardBiography()}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Standard-Biografie bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeite die Standard-Biografie für diesen Urheber. Änderungen
              wirken sich auf alle Projekte aus, die diese Biografie verwenden.
            </DialogDescription>
          </DialogHeader>

          {/* Impact Warning */}
          {author && author.projects && author.projects.length > 0 && (
            <Alert variant="warning" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Wichtiger Hinweis:</strong> Diese Standard-Biografie
                wird in {author.projects.length} Projekt(en) verwendet.
                Änderungen werden automatisch in allen zugeordneten Projekten
                übernommen. Bei Projekten mit veröffentlichten Ausgaben wird
                diese Änderung in der Vergleichsansicht angezeigt.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="standard-biography">Biografie-Text</Label>
              <Textarea
                id="standard-biography"
                value={standardBiographyText}
                onChange={(e) => setStandardBiographyText(e.target.value)}
                placeholder="Gib hier die Standard-Biografie für diesen Urheber ein..."
                rows={8}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleCancelStandardBiography}>
              <X className="h-4 w-4 mr-2" />
              Abbrechen
            </Button>
            <Button
              onClick={handleSaveStandardBiography}
              disabled={!standardBiographyText.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

// Import the reusable AuthorBasicDataForm component
import AuthorBasicDataForm, {
  BasicAuthorFormValues as AuthorBasicFormValues,
} from "@/components/Authors/AuthorBasicDataForm";

// Basic Data Form Component - now using the reusable component
const BasicDataForm = ({
  author,
  onSave,
  onCancel,
}: {
  author: Author;
  onSave: (data: AuthorBasicFormValues) => void;
  onCancel: () => void;
}) => {
  return (
    <AuthorBasicDataForm
      author={author}
      onSave={onSave}
      onCancel={onCancel}
      showButtons={true}
    />
  );
};

// Biography management moved to project-specific context

export default AuthorDetailPage;
