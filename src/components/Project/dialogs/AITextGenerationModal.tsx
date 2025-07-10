import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  XIcon,
  InfoIcon,
  SparklesIcon,
  FileTextIcon,
  RefreshCwIcon,
  EditIcon,
  MessageSquareIcon,
  UploadIcon,
  TrashIcon,
  PaperclipIcon,
  EyeOffIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BanIcon,
  PlusIcon,
} from "lucide-react";
import { getProjectAIData } from "@/lib/mockData/projects";
import { TreeSelect } from "@/components/ui/treeselect";
import {
  genreOptions,
  getAISuggestedGenres,
  getGenreLabel,
} from "@/lib/mockData/genres";

interface AITextGenerationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  onApplyTexts?: (texts: any) => void;
}

const AITextGenerationModal: React.FC<AITextGenerationModalProps> = ({
  isOpen,
  onOpenChange,
  project,
  onApplyTexts,
}) => {
  // State management
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasBookContent, setHasBookContent] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  // Versioning state - stores all versions for each field
  const [fieldVersions, setFieldVersions] = useState<{
    [field: string]: Array<{
      description?: string;
      slogan?: string;
      targetAudience?: string;
      sellingPoints?: string[];
      keywords?: string[];
      genres?: string[];
      titleSuggestions?: Array<{ title: string; subtitle?: string }>;
      selectedTitle?: { title: string; subtitle?: string };
    }>;
  }>({});

  // Current version index for each field
  const [currentVersionIndex, setCurrentVersionIndex] = useState<{
    [field: string]: number;
  }>({});

  const [generatedTexts, setGeneratedTexts] = useState<{
    description?: string;
    slogan?: string;
    targetAudience?: string;
    sellingPoints?: string[];
    keywords?: string[];
    genres?: string[];
    titleSuggestions?: Array<{ title: string; subtitle?: string }>;
    selectedTitle?: { title: string; subtitle?: string };
  }>({});
  const [editableTexts, setEditableTexts] = useState<{
    description?: string;
    slogan?: string;
    targetAudience?: string;
    sellingPoints?: string[];
    keywords?: string[];
    genres?: string[];
    titleSuggestions?: Array<{ title: string; subtitle?: string }>;
    selectedTitle?: { title: string; subtitle?: string };
  }>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  const [regeneratingField, setRegeneratingField] = useState<string | null>(
    null,
  );
  const [fieldFeedback, setFieldFeedback] = useState<{
    [key: string]: string;
  }>({});
  const [hasReviewedTexts, setHasReviewedTexts] = useState(false);
  const [textStatus, setTextStatus] = useState<{
    [key: string]: "accepted" | "rejected" | null;
  }>({});
  const [fieldGenerationCounts, setFieldGenerationCounts] = useState<{
    [key: string]: number;
  }>({});
  const [isTitleSectionHidden, setIsTitleSectionHidden] = useState(true);
  const MAX_GENERATIONS_PER_FIELD = 5;
  const [showFeedbackSection, setShowFeedbackSection] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState("");

  // Load mock data based on project ID
  useEffect(() => {
    const aiData = getProjectAIData(project?.id);
    if (aiData) {
      setHasBookContent(aiData.hasBookContent);
      setFieldGenerationCounts(aiData.fieldGenerationCounts || {});
      setUploadedFileName("Marketing für Kleinunternehmen.pdf");

      // If there are pre-generated texts, set them
      if (aiData.generatedTexts) {
        setGeneratedTexts(aiData.generatedTexts);
        setEditableTexts(aiData.generatedTexts);

        // Initialize versions with the existing data
        const initialVersions: { [field: string]: any[] } = {};
        const initialVersionIndex: { [field: string]: number } = {};

        Object.entries(aiData.generatedTexts).forEach(([field, value]) => {
          initialVersions[field] = [{ [field]: value }];
          initialVersionIndex[field] = 0;
        });

        setFieldVersions(initialVersions);
        setCurrentVersionIndex(initialVersionIndex);
      }
    } else {
      setHasBookContent(false);
      setFieldGenerationCounts({});
      setGeneratedTexts({});
      setEditableTexts({});
      setUploadedFileName("");
    }
  }, [project?.id]);

  const handleCloseModal = () => {
    onOpenChange(false);
    setIsGenerating(false);
    setEditableTexts({});
    setEditingField(null);
    setHasReviewedTexts(false);
    setTextStatus({});
    // Don't reset fieldGenerationCounts - keep it persistent
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setHasBookContent(true);
      setUploadedFileName(file.name);
      console.log("File uploaded:", file.name);
    }
  };

  const handleDeleteFile = () => {
    setHasBookContent(false);
    setUploadedFileName("");
    setGeneratedTexts({});
    setEditableTexts({});
    console.log("File deleted");
  };

  const handleGenerateTexts = async () => {
    if (!hasBookContent) {
      alert("Bitte lade zuerst eine Datei hoch.");
      return;
    }

    // Check if any field can still be generated (initial generation)
    const canGenerate =
      Object.keys(fieldGenerationCounts).length === 0 ||
      Object.values(fieldGenerationCounts).some(
        (count) => count < MAX_GENERATIONS_PER_FIELD,
      );

    if (!canGenerate) {
      alert(
        `Alle Felder haben bereits das Limit von ${MAX_GENERATIONS_PER_FIELD} Generierungen erreicht.`,
      );
      return;
    }

    setIsGenerating(true);

    // Increment generation count for all fields that will be generated
    const fieldsToGenerate = [
      "description",
      "genres",
      "slogan",
      "targetAudience",
      "sellingPoints",
      "keywords",
      "titleSuggestions",
    ];
    setFieldGenerationCounts((prev) => {
      const newCounts = { ...prev };
      fieldsToGenerate.forEach((field) => {
        newCounts[field] = (newCounts[field] || 0) + 1;
      });
      return newCounts;
    });

    // Simulate AI text generation
    setTimeout(() => {
      // Get AI-suggested genres based on uploaded content
      const suggestedGenres = getAISuggestedGenres(uploadedFileName);

      const mockGeneratedTexts = {
        description:
          "Ein fesselnder Roman über die Reise eines jungen Protagonisten, der sich auf eine abenteuerliche Suche nach der Wahrheit begibt. Mit lebendigen Charakteren und einer packenden Handlung entführt dieses Buch die Leser in eine Welt voller Überraschungen und emotionaler Tiefe.",
        slogan: "Eine Reise, die alles verändert",
        targetAudience:
          "Dieses Buch richtet sich an Leser, die packende Geschichten mit tiefgreifenden Charakterentwicklungen schätzen. Besonders geeignet für Liebhaber von Abenteuerromanen und emotionalen Erzählungen.",
        sellingPoints: [
          "Packende Handlung",
          "Lebendige Charaktere",
          "Emotionale Tiefe",
          "Überraschende Wendungen",
        ],
        keywords: [
          "Abenteuer",
          "Roman",
          "Charakterentwicklung",
          "Emotionen",
          "Reise",
        ],
        genres: suggestedGenres,
        titleSuggestions: [
          {
            title: "Der Weg zum Erfolg",
            subtitle: "Strategien für nachhaltiges Wachstum",
          },
          {
            title: "Marketing Revolution",
            subtitle: "Wie kleine Unternehmen große Wirkung erzielen",
          },
          {
            title: "Vom Startup zum Marktführer",
            subtitle: "Bewährte Methoden für Kleinunternehmer",
          },
          {
            title: "Erfolgreich werben ohne Millionenbudget",
            subtitle: "Kreative Lösungen für clevere Unternehmer",
          },
          {
            title: "Die Kunst des smarten Marketings",
            subtitle: "Maximaler Erfolg mit minimalen Ressourcen",
          },
        ],
      };

      setGeneratedTexts(mockGeneratedTexts);
      setEditableTexts(mockGeneratedTexts);

      // Initialize or update versions
      const newVersions = { ...fieldVersions };
      const newVersionIndex = { ...currentVersionIndex };

      Object.entries(mockGeneratedTexts).forEach(([field, value]) => {
        if (!newVersions[field]) {
          newVersions[field] = [];
          newVersionIndex[field] = 0;
        }

        // Add new version
        newVersions[field].push({ [field]: value });
        newVersionIndex[field] = newVersions[field].length - 1;

        // Keep only last 5 versions
        if (newVersions[field].length > MAX_GENERATIONS_PER_FIELD) {
          newVersions[field] = newVersions[field].slice(
            -MAX_GENERATIONS_PER_FIELD,
          );
          newVersionIndex[field] = newVersions[field].length - 1;
        }
      });

      setFieldVersions(newVersions);
      setCurrentVersionIndex(newVersionIndex);
      setIsGenerating(false);
      setHasReviewedTexts(false);
      setTextStatus({});
    }, 3000);
  };

  const handleApplyGeneratedTexts = () => {
    // Only apply texts that are not explicitly rejected
    const textsToApply: any = {};
    Object.entries(editableTexts).forEach(([field, text]) => {
      const status = textStatus[field];
      if (status !== "rejected") {
        textsToApply[field] = text;
      }
    });

    // Apply texts to the project
    console.log("Applying generated texts to project:", textsToApply);
    onApplyTexts?.(textsToApply);

    // Close modal
    handleCloseModal();
  };

  const handleRegenerateWithFeedback = async () => {
    if (!feedbackInput.trim()) {
      alert("Bitte gib ein Feedback ein, um die Texte zu verbessern.");
      return;
    }

    // Check if any field can still be regenerated
    const canRegenerate = Object.values(fieldGenerationCounts).some(
      (count) => count < MAX_GENERATIONS_PER_FIELD,
    );

    if (!canRegenerate) {
      alert(
        `Alle Felder haben bereits das Limit von ${MAX_GENERATIONS_PER_FIELD} Generierungen erreicht.`,
      );
      return;
    }

    setIsGenerating(true);
    setShowFeedbackSection(false);

    // Increment generation count for all fields that will be regenerated
    const fieldsToRegenerate = [
      "description",
      "genres",
      "slogan",
      "targetAudience",
      "sellingPoints",
      "keywords",
      "titleSuggestions",
    ];
    setFieldGenerationCounts((prev) => {
      const newCounts = { ...prev };
      fieldsToRegenerate.forEach((field) => {
        if ((newCounts[field] || 0) < MAX_GENERATIONS_PER_FIELD) {
          newCounts[field] = (newCounts[field] || 0) + 1;
        }
      });
      return newCounts;
    });

    // Simulate AI text regeneration with feedback
    setTimeout(() => {
      const feedbackLower = feedbackInput.toLowerCase();
      let newTexts = { ...generatedTexts };

      // Simulate different responses based on feedback
      if (
        feedbackLower.includes("spannung") ||
        feedbackLower.includes("spannend")
      ) {
        newTexts = {
          description:
            "Ein atemberaubender Thriller über einen jungen Protagonisten, der in ein gefährliches Netz aus Geheimnissen und Verrat gerät. Mit nervenaufreibenden Wendungen und einer rasanten Handlung hält dieses Buch die Leser bis zur letzten Seite in Atem.",
          slogan: "Spannung bis zur letzten Seite",
          targetAudience:
            "Perfekt für Leser, die Nervenkitzel und packende Thriller lieben. Besonders geeignet für Fans von Psychothrillern und Spannungsromanen.",
          sellingPoints: [
            "Nervenaufreibende Spannung",
            "Unvorhersehbare Wendungen",
            "Fesselnde Handlung",
            "Psychologische Tiefe",
          ],
          keywords: [
            "Thriller",
            "Spannung",
            "Geheimnis",
            "Verrat",
            "Nervenkitzel",
          ],
        };
      } else if (
        feedbackLower.includes("hauptfigur") ||
        feedbackLower.includes("charakter")
      ) {
        newTexts = {
          description:
            "Die bewegende Geschichte von Alex, einem jungen Menschen, der sich auf eine transformative Reise begibt. Mit außergewöhnlicher Charaktertiefe und emotionaler Authentizität erzählt dieser Roman von persönlichem Wachstum, Mut und der Kraft der Selbstentdeckung.",
          slogan: "Eine Reise zu sich selbst",
          targetAudience:
            "Ideal für Leser, die sich für tiefgreifende Charakterstudien und persönliche Entwicklungsgeschichten interessieren. Besonders ansprechend für alle, die authentische und emotionale Erzählungen schätzen.",
          sellingPoints: [
            "Tiefe Charakterentwicklung",
            "Emotionale Authentizität",
            "Persönliches Wachstum",
            "Inspirierende Botschaft",
          ],
          keywords: [
            "Charakterstudie",
            "Persönlichkeitsentwicklung",
            "Selbstentdeckung",
            "Emotion",
            "Wachstum",
          ],
        };
      } else if (
        feedbackLower.includes("romantisch") ||
        feedbackLower.includes("liebe")
      ) {
        newTexts = {
          description:
            "Eine bezaubernde Liebesgeschichte über zwei Menschen, die sich gegen alle Widerstände finden. Mit poetischer Sprache und gefühlvollen Momenten erzählt dieser Roman von der transformativen Kraft der Liebe und dem Mut, für das Glück zu kämpfen.",
          slogan: "Liebe findet immer einen Weg",
          targetAudience:
            "Perfekt für Liebhaber romantischer Geschichten und emotionaler Erzählungen. Besonders geeignet für Leser, die sich nach herzerwärmenden und hoffnungsvollen Geschichten sehnen.",
          sellingPoints: [
            "Romantische Atmosphäre",
            "Emotionale Tiefe",
            "Poetische Sprache",
            "Hoffnungsvolle Botschaft",
          ],
          keywords: ["Romantik", "Liebe", "Beziehung", "Emotion", "Poesie"],
        };
      } else {
        // Generic improvement based on feedback
        newTexts = {
          description:
            "Eine außergewöhnliche Geschichte, die mit ihrer einzigartigen Perspektive und fesselnden Erzählweise begeistert. Dieser Roman verbindet meisterhafte Charakterzeichnung mit einer vielschichtigen Handlung und bietet Lesern ein unvergessliches Erlebnis.",
          slogan: "Eine Geschichte, die bewegt",
          targetAudience:
            "Für anspruchsvolle Leser, die Qualitätsliteratur mit Tiefgang schätzen. Besonders geeignet für alle, die sich von außergewöhnlichen Geschichten inspirieren lassen möchten.",
          sellingPoints: [
            "Einzigartige Perspektive",
            "Meisterhafte Erzählkunst",
            "Vielschichtige Handlung",
            "Unvergessliches Erlebnis",
          ],
          keywords: [
            "Qualitätsliteratur",
            "Erzählkunst",
            "Inspiration",
            "Tiefgang",
            "Außergewöhnlich",
          ],
        };
      }

      setGeneratedTexts(newTexts);
      setEditableTexts(newTexts);
      setIsGenerating(false);
      setShowFeedbackSection(true);
      setFeedbackInput("");
      setTextStatus({});
    }, 2500);
  };

  const handleRegenerateField = async (field: string, feedback?: string) => {
    const currentCount = fieldGenerationCounts[field] || 0;
    if (currentCount >= MAX_GENERATIONS_PER_FIELD) {
      alert(
        `Du hast bereits ${MAX_GENERATIONS_PER_FIELD} Mal Texte für dieses Feld generiert. Das Limit wurde erreicht, um Kosten zu begrenzen.`,
      );
      return;
    }

    setRegeneratingField(field);
    setFieldGenerationCounts((prev) => ({
      ...prev,
      [field]: currentCount + 1,
    }));

    // Simulate AI text regeneration for single field
    setTimeout(() => {
      const feedbackLower = (feedback || "").toLowerCase();
      let newText = "";

      // Generate new text based on field and feedback
      switch (field) {
        case "description":
          if (feedbackLower.includes("spannung")) {
            newText =
              "Ein nervenaufreibender Thriller, der die Leser von der ersten bis zur letzten Seite fesselt. Mit unvorhersehbaren Wendungen und einer rasanten Handlung.";
          } else if (feedbackLower.includes("romantisch")) {
            newText =
              "Eine herzerwärmende Liebesgeschichte voller Emotionen und poetischer Momente, die das Herz berührt.";
          } else {
            newText =
              "Eine fesselnde Geschichte mit vielschichtigen Charakteren und einer packenden Handlung, die zum Nachdenken anregt.";
          }
          break;
        case "slogan":
          if (feedbackLower.includes("spannung")) {
            newText = "Nervenkitzel pur";
          } else if (feedbackLower.includes("romantisch")) {
            newText = "Liebe kennt keine Grenzen";
          } else {
            newText = "Eine Geschichte, die berührt";
          }
          break;
        case "targetAudience":
          if (feedbackLower.includes("jung")) {
            newText =
              "Perfekt für junge Erwachsene und alle, die sich für moderne, zeitgemäße Geschichten begeistern.";
          } else {
            newText =
              "Ideal für Leser, die anspruchsvolle Literatur mit emotionaler Tiefe schätzen.";
          }
          break;
        case "sellingPoints":
          if (feedbackLower.includes("spannung")) {
            newText = [
              "Nervenaufreibende Spannung",
              "Unvorhersehbare Wendungen",
              "Fesselnde Handlung",
            ];
          } else {
            newText = [
              "Emotionale Tiefe",
              "Authentische Charaktere",
              "Packende Handlung",
            ];
          }
          break;
        case "keywords":
          if (feedbackLower.includes("spannung")) {
            newText = [
              "Thriller",
              "Spannung",
              "Nervenkitzel",
              "Wendungen",
              "Geheimnis",
            ];
          } else {
            newText = [
              "Roman",
              "Emotion",
              "Charaktere",
              "Geschichte",
              "Tiefgang",
            ];
          }
          break;
        case "genres":
          // Generate new genre suggestions based on feedback
          const newGenres = getAISuggestedGenres(feedback);
          setEditableTexts((prev) => ({
            ...prev,
            [field]: newGenres,
          }));
          setGeneratedTexts((prev) => ({
            ...prev,
            [field]: newGenres,
          }));

          // Update versions for genres
          const updatedVersions = { ...fieldVersions };
          const updatedVersionIndex = { ...currentVersionIndex };

          if (!updatedVersions[field]) {
            updatedVersions[field] = [];
            updatedVersionIndex[field] = 0;
          }

          updatedVersions[field].push({ [field]: newGenres });
          updatedVersionIndex[field] = updatedVersions[field].length - 1;

          if (updatedVersions[field].length > MAX_GENERATIONS_PER_FIELD) {
            updatedVersions[field] = updatedVersions[field].slice(
              -MAX_GENERATIONS_PER_FIELD,
            );
            updatedVersionIndex[field] = updatedVersions[field].length - 1;
          }

          setFieldVersions(updatedVersions);
          setCurrentVersionIndex(updatedVersionIndex);
          setRegeneratingField(null);
          setFieldFeedback((prev) => {
            const newFeedback = { ...prev };
            delete newFeedback[field];
            return newFeedback;
          });
          return; // Early return for genres
        case "titleSuggestions":
          // Generate new title suggestions
          const newTitleSuggestions = [
            {
              title: "Neue Titel-Idee 1",
              subtitle: "Ein frischer Ansatz für dein Buch",
            },
            {
              title: "Innovative Lösungen",
              subtitle: "Kreative Wege zum Erfolg",
            },
            {
              title: "Der ultimative Ratgeber",
              subtitle: "Alles was du wissen musst",
            },
          ];
          setEditableTexts((prev) => ({
            ...prev,
            [field]: newTitleSuggestions,
          }));
          setGeneratedTexts((prev) => ({
            ...prev,
            [field]: newTitleSuggestions,
          }));

          // Update versions for titleSuggestions
          const updatedTitleVersions = { ...fieldVersions };
          const updatedTitleVersionIndex = { ...currentVersionIndex };

          if (!updatedTitleVersions[field]) {
            updatedTitleVersions[field] = [];
            updatedTitleVersionIndex[field] = 0;
          }

          updatedTitleVersions[field].push({ [field]: newTitleSuggestions });
          updatedTitleVersionIndex[field] =
            updatedTitleVersions[field].length - 1;

          if (updatedTitleVersions[field].length > MAX_GENERATIONS_PER_FIELD) {
            updatedTitleVersions[field] = updatedTitleVersions[field].slice(
              -MAX_GENERATIONS_PER_FIELD,
            );
            updatedTitleVersionIndex[field] =
              updatedTitleVersions[field].length - 1;
          }

          setFieldVersions(updatedTitleVersions);
          setCurrentVersionIndex(updatedTitleVersionIndex);
          setRegeneratingField(null);
          setFieldFeedback((prev) => {
            const newFeedback = { ...prev };
            delete newFeedback[field];
            return newFeedback;
          });
          return; // Early return for titleSuggestions
        case "selectedTitle":
          // Generate new title variants for selected title
          const newTitleVariants = [
            {
              title: "Überarbeiteter Titel",
              subtitle: "Neue Perspektive auf dein Thema",
            },
          ];
          const newSelectedTitle = newTitleVariants[0];
          setEditableTexts((prev) => ({
            ...prev,
            [field]: newSelectedTitle,
          }));
          setGeneratedTexts((prev) => ({
            ...prev,
            [field]: newSelectedTitle,
          }));

          // Update versions for selectedTitle
          const updatedSelectedVersions = { ...fieldVersions };
          const updatedSelectedVersionIndex = { ...currentVersionIndex };

          if (!updatedSelectedVersions[field]) {
            updatedSelectedVersions[field] = [];
            updatedSelectedVersionIndex[field] = 0;
          }

          updatedSelectedVersions[field].push({ [field]: newSelectedTitle });
          updatedSelectedVersionIndex[field] =
            updatedSelectedVersions[field].length - 1;

          if (
            updatedSelectedVersions[field].length > MAX_GENERATIONS_PER_FIELD
          ) {
            updatedSelectedVersions[field] = updatedSelectedVersions[
              field
            ].slice(-MAX_GENERATIONS_PER_FIELD);
            updatedSelectedVersionIndex[field] =
              updatedSelectedVersions[field].length - 1;
          }

          setFieldVersions(updatedSelectedVersions);
          setCurrentVersionIndex(updatedSelectedVersionIndex);
          setRegeneratingField(null);
          setFieldFeedback((prev) => {
            const newFeedback = { ...prev };
            delete newFeedback[field];
            return newFeedback;
          });
          return; // Early return for selectedTitle
        default:
          newText = "Neuer generierter Text";
      }

      setEditableTexts((prev) => ({
        ...prev,
        [field]: newText,
      }));

      setGeneratedTexts((prev) => ({
        ...prev,
        [field]: newText,
      }));

      // Update versions
      const updatedVersions = { ...fieldVersions };
      const updatedVersionIndex = { ...currentVersionIndex };

      if (!updatedVersions[field]) {
        updatedVersions[field] = [];
        updatedVersionIndex[field] = 0;
      }

      updatedVersions[field].push({ [field]: newText });
      updatedVersionIndex[field] = updatedVersions[field].length - 1;

      if (updatedVersions[field].length > MAX_GENERATIONS_PER_FIELD) {
        updatedVersions[field] = updatedVersions[field].slice(
          -MAX_GENERATIONS_PER_FIELD,
        );
        updatedVersionIndex[field] = updatedVersions[field].length - 1;
      }

      setFieldVersions(updatedVersions);
      setCurrentVersionIndex(updatedVersionIndex);
      setRegeneratingField(null);

      // Clear field feedback after regeneration
      setFieldFeedback((prev) => {
        const newFeedback = { ...prev };
        delete newFeedback[field];
        return newFeedback;
      });
    }, 2000);
  };

  const handleFieldFeedbackChange = (field: string, feedback: string) => {
    setFieldFeedback((prev) => ({
      ...prev,
      [field]: feedback,
    }));
  };

  const handleEditText = (field: string, value: string) => {
    setEditableTexts((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStartEditing = (field: string) => {
    setEditingField(field);
  };

  const handleStopEditing = () => {
    setEditingField(null);
  };

  const handleRejectText = (field: string) => {
    setTextStatus((prev) => {
      const currentStatus = prev[field];
      const newStatus = currentStatus === "rejected" ? null : "rejected";
      console.log(
        `Text for ${field} ${newStatus === "rejected" ? "rejected" : "re-enabled"}`,
      );
      return {
        ...prev,
        [field]: newStatus,
      };
    });
    setHasReviewedTexts(true);
  };

  // Version navigation functions
  const navigateToVersion = (field: string, versionIndex: number) => {
    if (
      !fieldVersions[field] ||
      versionIndex < 0 ||
      versionIndex >= fieldVersions[field].length
    ) {
      return;
    }

    setCurrentVersionIndex((prev) => ({
      ...prev,
      [field]: versionIndex,
    }));

    const versionData = fieldVersions[field][versionIndex];
    const fieldValue = versionData[field];

    setEditableTexts((prev) => ({
      ...prev,
      [field]: fieldValue,
    }));

    setGeneratedTexts((prev) => ({
      ...prev,
      [field]: fieldValue,
    }));
  };

  const getVersionNavigation = (field: string) => {
    const versions = fieldVersions[field] || [];
    const currentIndex = currentVersionIndex[field] || 0;

    if (versions.length <= 1) {
      return null;
    }

    return (
      <div className="flex items-center justify-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 hover:bg-purple-50 hover:border-purple-400 rounded-lg mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateToVersion(field, currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-1 h-6 w-6 hover:bg-purple-100 text-purple-600"
        >
          <ChevronLeftIcon className="h-3 w-3" />
        </Button>
        <span className="text-sm text-gray-700 font-medium text-center min-w-[120px]">
          Version {currentIndex + 1} von {versions.length}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateToVersion(field, currentIndex + 1)}
          disabled={currentIndex === versions.length - 1}
          className="p-1 h-6 w-6 hover:bg-purple-100 text-purple-600"
        >
          <ChevronRightIcon className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:w-[800px] sm:max-w-[800px] overflow-y-auto"
        side="right"
      >
        <SheetHeader className="px-4 sm:px-6 text-left pb-6">
          <SheetTitle className="flex items-center gap-3 text-lg sm:text-xl text-left">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
            KI-gestützte Textgenerierung
          </SheetTitle>
          <SheetDescription className="text-sm sm:text-base mt-2 text-left">
            Lade eine beliebige Datei hoch (z.B. Buchinnenteil, Exposé, Notizen)
            und lasse dir passende Vermarktungstexte erstellen.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 sm:space-y-8 px-4 sm:px-6">
          {/* Upload Section */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-purple-100">
            <div className="flex items-start gap-4">
              <InfoIcon className="h-5 w-5 text-purple-600 mt-1" />
              <div className="flex-1 space-y-4">
                <div>
                  <h5 className="font-semibold text-purple-900 text-base sm:text-lg mb-2">
                    Datei als Basis hochladen
                  </h5>
                  <p className="text-purple-800 leading-relaxed text-sm sm:text-base">
                    Für die automatische Generierung von Vermarktungstexten
                    kannst du eine beliebige Datei hochladen (z.B.
                    Buchinnenteil, Exposé, Notizen).
                  </p>
                </div>

                {/* Upload Area */}
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      id="book-upload"
                      type="file"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="p-4 sm:p-6 border-2 border-dashed border-purple-300 rounded-lg bg-white/70 hover:bg-white hover:border-purple-400 transition-all text-center">
                      <UploadIcon className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-purple-500" />
                      <p className="text-purple-700 font-medium mb-1 text-sm sm:text-base">
                        Datei auswählen
                      </p>
                      <p className="text-xs sm:text-sm text-purple-600">
                        Klicke hier oder ziehe deine Datei hierher
                      </p>
                    </div>
                  </div>

                  {/* File Display */}
                  {hasBookContent && uploadedFileName && (
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/80 border border-purple-200 rounded-lg">
                      <PaperclipIcon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                      <span className="text-gray-700 flex-1 font-medium text-sm sm:text-base truncate">
                        {uploadedFileName}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleDeleteFile}
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 flex-shrink-0"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Generate Button - moved here */}
                  {hasBookContent &&
                    Object.keys(generatedTexts).length === 0 && (
                      <div className="mt-4 sm:mt-6 text-center">
                        <Button
                          onClick={handleGenerateTexts}
                          disabled={isGenerating}
                          size="lg"
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg disabled:bg-gray-400 px-6 sm:px-8 py-3 w-full sm:w-auto"
                        >
                          {isGenerating ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              <span className="hidden sm:inline">
                                Generiere Texte...
                              </span>
                              <span className="sm:hidden">Generiere...</span>
                            </>
                          ) : (
                            <>
                              <SparklesIcon className="h-5 w-5 mr-3" />
                              Texte generieren
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Generation Section */}
          {hasBookContent && (
            <div className="space-y-8">
              {isGenerating && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-3 border-blue-600"></div>
                    <div className="text-center">
                      <p className="font-semibold text-blue-900 text-base sm:text-lg">
                        KI analysiert den Buchinhalt...
                      </p>
                      <p className="text-blue-700 mt-1 text-sm sm:text-base">
                        Dies kann einige Sekunden dauern.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {Object.keys(generatedTexts).length > 0 && !isGenerating && (
                <div className="space-y-6 sm:space-y-10">
                  {/* Title Suggestions Section - moved to top */}
                  {generatedTexts.titleSuggestions &&
                    generatedTexts.titleSuggestions.length > 0 && (
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-6">
                          <div className="flex-1">
                            <h5 className="font-bold text-emerald-900 text-lg sm:text-xl mb-2 sm:mb-3">
                              Neue Titel-Inspirationen für dich
                            </h5>
                            <p className="text-emerald-700 leading-relaxed text-sm sm:text-base">
                              Basierend auf deinem Buchinhalt haben wir
                              alternative Titel- und Untertitel-Kombinationen
                              erstellt. Vielleicht ist ja der perfekte Titel für
                              dein Buch dabei?
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setIsTitleSectionHidden(!isTitleSectionHidden)
                            }
                            className="text-emerald-700 border-emerald-300 hover:text-emerald-800 hover:bg-emerald-100 flex-shrink-0 w-full sm:w-auto"
                          >
                            <span className="hidden sm:inline">
                              {isTitleSectionHidden
                                ? "Titelvorschläge anzeigen"
                                : "Titelvorschläge ausblenden"}
                            </span>
                            <span className="sm:hidden">
                              {isTitleSectionHidden ? "Anzeigen" : "Ausblenden"}
                            </span>
                          </Button>
                        </div>

                        {!isTitleSectionHidden && (
                          <>
                            <div className="space-y-4">
                              {generatedTexts.titleSuggestions.map(
                                (suggestion, index) => (
                                  <div
                                    key={index}
                                    className="p-3 sm:p-5 bg-white/80 border border-emerald-200 rounded-xl hover:shadow-lg hover:bg-white transition-all cursor-pointer group"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Select this title suggestion for editing
                                      setEditableTexts((prev) => ({
                                        ...prev,
                                        selectedTitle: suggestion,
                                      }));

                                      setGeneratedTexts((prev) => ({
                                        ...prev,
                                        selectedTitle: suggestion,
                                      }));

                                      // Hide the title suggestions section
                                      setIsTitleSectionHidden(true);

                                      // Initialize versions for selectedTitle if not exists
                                      setFieldVersions((prev) => {
                                        const newVersions = { ...prev };
                                        if (!newVersions.selectedTitle) {
                                          newVersions.selectedTitle = [];
                                        }
                                        newVersions.selectedTitle.push({
                                          selectedTitle: suggestion,
                                        });
                                        return newVersions;
                                      });

                                      setCurrentVersionIndex((prev) => ({
                                        ...prev,
                                        selectedTitle:
                                          fieldVersions.selectedTitle?.length ||
                                          0,
                                      }));

                                      // Start editing the selected title immediately
                                      setEditingField("selectedTitle");

                                      console.log(
                                        "Selected title suggestion:",
                                        suggestion,
                                      );
                                    }}
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                      <div className="flex-1 space-y-1">
                                        <h6 className="font-semibold text-gray-900 text-base sm:text-lg group-hover:text-emerald-800 transition-colors">
                                          {suggestion.title}
                                        </h6>
                                        {suggestion.subtitle && (
                                          <p className="text-gray-600 group-hover:text-emerald-700 transition-colors text-sm sm:text-base">
                                            {suggestion.subtitle}
                                          </p>
                                        )}
                                      </div>
                                      <div className="sm:ml-6">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-emerald-700 border-emerald-300 hover:bg-emerald-100 w-full sm:w-auto"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Select this title suggestion for editing
                                            setEditableTexts((prev) => ({
                                              ...prev,
                                              selectedTitle: suggestion,
                                            }));

                                            setGeneratedTexts((prev) => ({
                                              ...prev,
                                              selectedTitle: suggestion,
                                            }));

                                            // Hide the title suggestions section
                                            setIsTitleSectionHidden(true);

                                            // Initialize versions for selectedTitle if not exists
                                            setFieldVersions((prev) => {
                                              const newVersions = { ...prev };
                                              if (!newVersions.selectedTitle) {
                                                newVersions.selectedTitle = [];
                                              }
                                              newVersions.selectedTitle.push({
                                                selectedTitle: suggestion,
                                              });
                                              return newVersions;
                                            });

                                            setCurrentVersionIndex((prev) => ({
                                              ...prev,
                                              selectedTitle:
                                                fieldVersions.selectedTitle
                                                  ?.length || 0,
                                            }));

                                            // Start editing the selected title immediately
                                            setEditingField("selectedTitle");

                                            console.log(
                                              "Selected title suggestion:",
                                              suggestion,
                                            );
                                          }}
                                        >
                                          Auswählen
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>

                            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-emerald-100/60 rounded-xl">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <InfoIcon className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                <div className="text-xs sm:text-sm text-emerald-800">
                                  <div className="mb-1 sm:mb-0 sm:inline">
                                    <strong>Aktueller Titel:</strong>{" "}
                                    {project?.title}
                                  </div>
                                  {project?.subtitle && (
                                    <div className="sm:inline">
                                      <span className="hidden sm:inline">
                                        {" "}
                                        •{" "}
                                      </span>
                                      <strong>Untertitel:</strong>{" "}
                                      {project.subtitle}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                  <div className="text-center py-4 sm:py-6">
                    <h5 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      Deine Vermarktungstexte
                    </h5>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Bearbeite die Texte nach deinen Wünschen oder generiere
                      neue Versionen.
                    </p>
                  </div>

                  {/* Generated Texts with Edit Functionality */}
                  <div className="space-y-6 sm:space-y-8">
                    {/* Define field order with genres at position 2 */}
                    {(() => {
                      const fieldOrder = [
                        "selectedTitle",
                        "description",
                        "genres",
                        "slogan",
                        "targetAudience",
                        "sellingPoints",
                        "keywords",
                      ];

                      const fieldLabels: { [key: string]: string } = {
                        selectedTitle: "Ausgewählter Titel",
                        description: "Beschreibung",
                        genres: "Genres",
                        slogan: "Slogan",
                        targetAudience: "Zielgruppe",
                        sellingPoints: "Kaufargumente",
                        keywords: "Suchbegriffe",
                      };

                      return fieldOrder
                        .filter((field) => editableTexts[field] !== undefined)
                        .map((field) => {
                          const text = editableTexts[field];

                          const status = textStatus[field];
                          const borderColor =
                            status === "rejected"
                              ? "border-red-300"
                              : "border-gray-200";
                          const bgColor =
                            status === "rejected" ? "bg-red-50" : "bg-white";

                          return (
                            <div
                              key={field}
                              className={`p-4 sm:p-6 rounded-xl border-2 ${borderColor} ${bgColor} transition-all hover:shadow-sm`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-5 gap-3">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                  <Label className="text-base sm:text-lg font-semibold text-gray-900">
                                    {fieldLabels[field]}
                                  </Label>
                                  {status === "rejected" && (
                                    <Badge className="bg-red-100 text-red-800 border-red-300 w-fit">
                                      ✗ Nicht übernehmen
                                    </Badge>
                                  )}
                                  {getVersionNavigation(field)}
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                  {/* Editing button */}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      editingField === field
                                        ? handleStopEditing()
                                        : handleStartEditing(field)
                                    }
                                    className="text-slate-600 hover:text-slate-700 hover:bg-slate-50 p-2"
                                    title={
                                      editingField === field
                                        ? "Bearbeitung beenden"
                                        : "Text bearbeiten"
                                    }
                                  >
                                    <EditIcon className="h-4 w-4" />
                                  </Button>

                                  {/* Reject button */}
                                  <Button
                                    variant={
                                      status === "rejected"
                                        ? "default"
                                        : "ghost"
                                    }
                                    size="sm"
                                    onClick={() => handleRejectText(field)}
                                    className={`p-2 ${
                                      status === "rejected"
                                        ? "bg-red-600 text-white hover:bg-red-700"
                                        : "text-red-600 hover:text-red-700 hover:bg-red-50"
                                    }`}
                                    title="Text nicht übernehmen"
                                  >
                                    <BanIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {editingField === field ? (
                                <div className="space-y-4">
                                  {field === "selectedTitle" ? (
                                    <div className="space-y-2">
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="title-edit"
                                          className="text-sm font-medium text-gray-900"
                                        >
                                          Titel
                                        </Label>
                                        <Input
                                          id="title-edit"
                                          value={text?.title || ""}
                                          onChange={(e) => {
                                            const updatedTitle = {
                                              ...text,
                                              title: e.target.value,
                                            };
                                            handleEditText(field, updatedTitle);
                                          }}
                                          placeholder="Titel eingeben..."
                                          className="text-gray-700 placeholder:text-gray-400"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="subtitle-edit"
                                          className="text-sm font-medium text-gray-900"
                                        >
                                          Untertitel (optional)
                                        </Label>
                                        <Input
                                          id="subtitle-edit"
                                          value={text?.subtitle || ""}
                                          onChange={(e) => {
                                            const updatedTitle = {
                                              ...text,
                                              subtitle: e.target.value,
                                            };
                                            handleEditText(field, updatedTitle);
                                          }}
                                          placeholder="Untertitel eingeben..."
                                          className="text-gray-700 placeholder:text-gray-400"
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={handleStopEditing}
                                          className="bg-slate-600 hover:bg-slate-700 text-white"
                                        >
                                          <CheckIcon className="h-4 w-4 mr-1" />
                                          Fertig
                                        </Button>
                                      </div>
                                    </div>
                                  ) : field === "genres" ? (
                                    <div className="space-y-2">
                                      <TreeSelect
                                        options={genreOptions}
                                        selected={
                                          Array.isArray(text) ? text : []
                                        }
                                        onChange={(values) =>
                                          handleEditText(field, values)
                                        }
                                        placeholder="Genres auswählen"
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={handleStopEditing}
                                          className="bg-slate-600 hover:bg-slate-700 text-white"
                                        >
                                          <CheckIcon className="h-4 w-4 mr-1" />
                                          Fertig
                                        </Button>
                                      </div>
                                    </div>
                                  ) : field === "sellingPoints" ? (
                                    <div className="space-y-4">
                                      <div className="space-y-3">
                                        {Array.isArray(text) &&
                                          text.map((point, index) => (
                                            <div
                                              key={index}
                                              className="flex gap-2"
                                            >
                                              <Input
                                                value={point}
                                                onChange={(e) => {
                                                  const newPoints = [
                                                    ...(Array.isArray(text)
                                                      ? text
                                                      : []),
                                                  ];
                                                  newPoints[index] =
                                                    e.target.value;
                                                  handleEditText(
                                                    field,
                                                    newPoints,
                                                  );
                                                }}
                                                placeholder={`Kaufargument ${index + 1}`}
                                                className="flex-1 text-gray-700 placeholder:text-gray-400"
                                              />
                                              {text.length > 1 && (
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => {
                                                    const newPoints =
                                                      Array.isArray(text)
                                                        ? text.filter(
                                                            (_, i) =>
                                                              i !== index,
                                                          )
                                                        : [];
                                                    handleEditText(
                                                      field,
                                                      newPoints,
                                                    );
                                                  }}
                                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                                >
                                                  <TrashIcon className="h-4 w-4" />
                                                </Button>
                                              )}
                                            </div>
                                          ))}
                                        {(!Array.isArray(text) ||
                                          text.length < 5) && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              const currentPoints =
                                                Array.isArray(text) ? text : [];
                                              const newPoints = [
                                                ...currentPoints,
                                                "",
                                              ];
                                              handleEditText(field, newPoints);
                                            }}
                                            className="w-fit mx-auto bg-gray-50 hover:bg-gray-100 border-dashed border-2 text-gray-600 hover:text-gray-700"
                                          >
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Kaufargument hinzufügen
                                          </Button>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        Gib 1-5 kurze Kaufargumente ein (z.B.
                                        "Praxisnah", "Leicht verständlich")
                                      </p>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={handleStopEditing}
                                          className="bg-slate-600 hover:bg-slate-700 text-white"
                                        >
                                          <CheckIcon className="h-4 w-4 mr-1" />
                                          Fertig
                                        </Button>
                                      </div>
                                    </div>
                                  ) : field === "keywords" ? (
                                    <div className="space-y-2">
                                      <Input
                                        value={
                                          Array.isArray(text)
                                            ? text.join(", ")
                                            : ""
                                        }
                                        onChange={(e) => {
                                          const keywords = e.target.value
                                            .split(",")
                                            .map((k) => k.trim())
                                            .filter((k) => k.length > 0);
                                          handleEditText(field, keywords);
                                        }}
                                        placeholder="Suchbegriffe durch Kommas getrennt eingeben..."
                                        className="text-gray-700 placeholder:text-gray-400"
                                      />
                                      <p className="text-xs text-gray-500">
                                        Gib deine Suchbegriffe durch Kommas
                                        getrennt ein (z.B. "Marketing, Business,
                                        Strategie")
                                      </p>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={handleStopEditing}
                                          className="bg-slate-600 hover:bg-slate-700 text-white"
                                        >
                                          <CheckIcon className="h-4 w-4 mr-1" />
                                          Fertig
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-4 sm:space-y-6">
                                      <div className="p-3 sm:p-4 bg-gray-50/70 rounded-lg border border-gray-200">
                                        {field === "selectedTitle" ? (
                                          <div
                                            className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                                            onClick={() =>
                                              handleStartEditing(field)
                                            }
                                          >
                                            {text ? (
                                              <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                  {text.title}
                                                </p>
                                                {text.subtitle && (
                                                  <p className="text-sm text-gray-600">
                                                    {text.subtitle}
                                                  </p>
                                                )}
                                              </div>
                                            ) : (
                                              <p className="text-sm text-gray-500 italic">
                                                Kein Titel ausgewählt
                                              </p>
                                            )}
                                          </div>
                                        ) : field === "genres" ? (
                                          <div
                                            className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                                            onClick={() =>
                                              handleStartEditing(field)
                                            }
                                          >
                                            {Array.isArray(text) &&
                                            text.length > 0 ? (
                                              <div className="flex flex-wrap gap-2">
                                                {text.map(
                                                  (
                                                    genre: string,
                                                    index: number,
                                                  ) => (
                                                    <Badge
                                                      key={index}
                                                      variant="secondary"
                                                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 text-xs"
                                                    >
                                                      {getGenreLabel(genre)}
                                                    </Badge>
                                                  ),
                                                )}
                                              </div>
                                            ) : (
                                              <p className="text-sm text-gray-500 italic">
                                                Keine Genres ausgewählt
                                              </p>
                                            )}
                                          </div>
                                        ) : field === "keywords" ? (
                                          <div
                                            className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                                            onClick={() =>
                                              handleStartEditing(field)
                                            }
                                          >
                                            {Array.isArray(text) &&
                                            text.length > 0 ? (
                                              <div className="flex flex-wrap gap-2">
                                                {text.map(
                                                  (
                                                    keyword: string,
                                                    index: number,
                                                  ) => (
                                                    <Badge
                                                      key={index}
                                                      variant="secondary"
                                                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 text-xs"
                                                    >
                                                      {keyword}
                                                    </Badge>
                                                  ),
                                                )}
                                              </div>
                                            ) : (
                                              <p className="text-sm text-gray-500 italic">
                                                Keine Suchbegriffe vorhanden
                                              </p>
                                            )}
                                          </div>
                                        ) : (
                                          <p
                                            className="text-sm text-gray-700 leading-relaxed cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                                            onClick={() =>
                                              handleStartEditing(field)
                                            }
                                          >
                                            {text}
                                          </p>
                                        )}
                                      </div>

                                      {/* Individual Field Feedback */}
                                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 sm:p-5 border border-gray-200">
                                        {/* Labels Row */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                                          <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="p-1.5 bg-purple-100 rounded">
                                              <MessageSquareIcon className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <span className="text-xs sm:text-sm text-gray-700 font-medium">
                                              Feedback für Neugenerierung
                                              (optional)
                                            </span>
                                          </div>
                                          <div className="text-xs sm:text-sm text-gray-600 font-medium bg-white px-2 sm:px-3 py-1 rounded-full border w-fit">
                                            <span className="text-xs text-gray-500 mr-1 sm:mr-2">
                                              Generierungen:
                                            </span>
                                            {fieldGenerationCounts[field] || 0}{" "}
                                            / {MAX_GENERATIONS_PER_FIELD}
                                          </div>
                                        </div>

                                        {/* Input and Button Row */}
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                          <Input
                                            placeholder={`Feedback für ${fieldLabels[field]} (z.B. "mehr Spannung", "romantischer")...`}
                                            value={fieldFeedback[field] || ""}
                                            onChange={(e) =>
                                              handleFieldFeedbackChange(
                                                field,
                                                e.target.value,
                                              )
                                            }
                                            className="flex-1 bg-white text-gray-700 placeholder:text-gray-400"
                                          />
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              if (
                                                fieldFeedback[field]?.trim()
                                              ) {
                                                handleRegenerateField(
                                                  field,
                                                  fieldFeedback[field],
                                                );
                                              } else {
                                                handleRegenerateField(field);
                                              }
                                            }}
                                            disabled={
                                              regeneratingField === field ||
                                              (fieldGenerationCounts[field] ||
                                                0) >= MAX_GENERATIONS_PER_FIELD
                                            }
                                            className="text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 flex-shrink-0 px-3 sm:px-4 w-full sm:w-auto"
                                          >
                                            {regeneratingField === field ? (
                                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                                            ) : (
                                              <>
                                                <RefreshCwIcon className="h-4 w-4 mr-2" />
                                                <span className="hidden sm:inline">
                                                  {(fieldGenerationCounts[
                                                    field
                                                  ] || 0) >=
                                                  MAX_GENERATIONS_PER_FIELD
                                                    ? "Limit erreicht"
                                                    : "Neu generieren"}
                                                </span>
                                                <span className="sm:hidden">
                                                  {(fieldGenerationCounts[
                                                    field
                                                  ] || 0) >=
                                                  MAX_GENERATIONS_PER_FIELD
                                                    ? "Limit"
                                                    : "Neu"}
                                                </span>
                                              </>
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-4 sm:space-y-6">
                                  <div className="p-3 sm:p-4 bg-gray-50/70 rounded-lg border border-gray-200">
                                    {field === "selectedTitle" ? (
                                      <div
                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                                        onClick={() =>
                                          handleStartEditing(field)
                                        }
                                      >
                                        {text ? (
                                          <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-900">
                                              {text.title}
                                            </p>
                                            {text.subtitle && (
                                              <p className="text-sm text-gray-600">
                                                {text.subtitle}
                                              </p>
                                            )}
                                          </div>
                                        ) : (
                                          <p className="text-sm text-gray-500 italic">
                                            Kein Titel ausgewählt
                                          </p>
                                        )}
                                      </div>
                                    ) : field === "genres" ? (
                                      <div
                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                                        onClick={() =>
                                          handleStartEditing(field)
                                        }
                                      >
                                        {Array.isArray(text) &&
                                        text.length > 0 ? (
                                          <div className="flex flex-wrap gap-2">
                                            {text.map(
                                              (
                                                genre: string,
                                                index: number,
                                              ) => (
                                                <Badge
                                                  key={index}
                                                  variant="secondary"
                                                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 text-xs"
                                                >
                                                  {getGenreLabel(genre)}
                                                </Badge>
                                              ),
                                            )}
                                          </div>
                                        ) : (
                                          <p className="text-sm text-gray-500 italic">
                                            Keine Genres ausgewählt
                                          </p>
                                        )}
                                      </div>
                                    ) : field === "keywords" ? (
                                      <div
                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                                        onClick={() =>
                                          handleStartEditing(field)
                                        }
                                      >
                                        {Array.isArray(text) &&
                                        text.length > 0 ? (
                                          <div className="flex flex-wrap gap-2">
                                            {text.map(
                                              (
                                                keyword: string,
                                                index: number,
                                              ) => (
                                                <Badge
                                                  key={index}
                                                  variant="secondary"
                                                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 text-xs"
                                                >
                                                  {keyword}
                                                </Badge>
                                              ),
                                            )}
                                          </div>
                                        ) : (
                                          <p className="text-sm text-gray-500 italic">
                                            Keine Suchbegriffe vorhanden
                                          </p>
                                        )}
                                      </div>
                                    ) : (
                                      <p
                                        className="text-sm text-gray-700 leading-relaxed cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                                        onClick={() =>
                                          handleStartEditing(field)
                                        }
                                      >
                                        {text}
                                      </p>
                                    )}
                                  </div>

                                  {/* Individual Field Feedback */}
                                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 sm:p-5 border border-gray-200">
                                    {/* Labels Row */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                                      <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="p-1.5 bg-purple-100 rounded">
                                          <MessageSquareIcon className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-700 font-medium">
                                          Feedback für Neugenerierung (optional)
                                        </span>
                                      </div>
                                      <div className="text-xs sm:text-sm text-gray-600 font-medium bg-white px-2 sm:px-3 py-1 rounded-full border w-fit">
                                        <span className="text-xs text-gray-500 mr-1 sm:mr-2">
                                          Generierungen:
                                        </span>
                                        {fieldGenerationCounts[field] || 0} /{" "}
                                        {MAX_GENERATIONS_PER_FIELD}
                                      </div>
                                    </div>

                                    {/* Input and Button Row */}
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                      <Input
                                        placeholder={`Feedback für ${fieldLabels[field]} (z.B. "mehr Spannung", "romantischer")...`}
                                        value={fieldFeedback[field] || ""}
                                        onChange={(e) =>
                                          handleFieldFeedbackChange(
                                            field,
                                            e.target.value,
                                          )
                                        }
                                        className="flex-1 bg-white text-gray-700 placeholder:text-gray-400"
                                      />
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          if (fieldFeedback[field]?.trim()) {
                                            handleRegenerateField(
                                              field,
                                              fieldFeedback[field],
                                            );
                                          } else {
                                            handleRegenerateField(field);
                                          }
                                        }}
                                        disabled={
                                          regeneratingField === field ||
                                          (fieldGenerationCounts[field] || 0) >=
                                            MAX_GENERATIONS_PER_FIELD
                                        }
                                        className="text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 flex-shrink-0 px-3 sm:px-4 w-full sm:w-auto"
                                      >
                                        {regeneratingField === field ? (
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                                        ) : (
                                          <>
                                            <RefreshCwIcon className="h-4 w-4 mr-2" />
                                            <span className="hidden sm:inline">
                                              {(fieldGenerationCounts[field] ||
                                                0) >= MAX_GENERATIONS_PER_FIELD
                                                ? "Limit erreicht"
                                                : "Neu generieren"}
                                            </span>
                                            <span className="sm:hidden">
                                              {(fieldGenerationCounts[field] ||
                                                0) >= MAX_GENERATIONS_PER_FIELD
                                                ? "Limit"
                                                : "Neu"}
                                            </span>
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        });
                    })()}
                  </div>

                  {/* Close and Apply Buttons - moved to end of content */}
                  <div className="pt-6 sm:pt-8 border-t border-gray-200 mt-8 sm:mt-12">
                    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          onClick={handleCloseModal}
                          size="lg"
                          className="w-full sm:w-auto order-2 sm:order-1"
                        >
                          <XIcon className="h-4 w-4 mr-2" />
                          Schließen
                        </Button>
                        {Object.keys(editableTexts).length > 0 && (
                          <Button
                            onClick={handleApplyGeneratedTexts}
                            size="lg"
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg px-4 sm:px-6 w-full sm:w-auto order-1 sm:order-2"
                          >
                            <CheckIcon className="h-4 w-4 mr-2" />
                            Texte übernehmen
                          </Button>
                        )}
                      </div>
                      {Object.keys(editableTexts).length > 0 && (
                        <p className="text-xs sm:text-sm text-gray-600 text-center max-w-md leading-relaxed px-4">
                          Du kannst dieses Fenster jederzeit wieder öffnen und
                          weitere Änderungen vornehmen.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AITextGenerationModal;
