import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TreeSelect } from "@/components/ui/treeselect";
import {
  genreOptions as genreOptionsData,
  getGenreLabel,
} from "@/lib/mockData/genres";
import {
  targetAudienceOptions,
  getTargetAudienceLabel,
} from "@/lib/mockData/targetAudience";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  CheckIcon,
  StarIcon,
  SaveIcon,
  XIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  SparklesIcon,
  ChevronRight,
  ChevronLeft,
  QuoteIcon,
} from "lucide-react";
import AITextGenerationModal from "@/components/Project/dialogs/AITextGenerationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthorPublisherSection from "@/components/Project/AuthorPublisherSection";

interface ProjectDetailsProps {
  project: any;
  projectAuthors: any[];
  onAuthorOrderChange?: (reorderedAuthors: any[]) => void;
  onRemoveAuthor?: (authorId: string) => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  projectAuthors,
  onAuthorOrderChange,
  onRemoveAuthor,
}) => {
  const [isEditSlideoutOpen, setIsEditSlideoutOpen] = React.useState(false);
  const [modalEditedProject, setModalEditedProject] = React.useState(project);
  const [displayProject, setDisplayProject] = React.useState(project);

  // KI-Texte generieren modal state
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);

  // Load project data from localStorage on component mount
  React.useEffect(() => {
    if (project?.id) {
      const storedProjectData = localStorage.getItem(
        `project_details_${project.id}`,
      );
      if (storedProjectData) {
        try {
          const parsedData = JSON.parse(storedProjectData);
          setDisplayProject({ ...project, ...parsedData });
        } catch (error) {
          console.error("Error parsing stored project data:", error);
          setDisplayProject(project);
        }
      } else {
        setDisplayProject(project);
      }
    }
  }, [project]);

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

  const handleSlideoutSave = () => {
    // Save to localStorage
    if (project?.id && modalEditedProject) {
      const dataToSave = {
        description: modalEditedProject.description,
        genres: modalEditedProject.genres,
        slogan: modalEditedProject.slogan,
        targetAudience: modalEditedProject.targetAudience,
        target_audience: modalEditedProject.targetAudience,
        targetAudienceGroups: modalEditedProject.targetAudienceGroups,
        target_audience_groups: modalEditedProject.targetAudienceGroups,
        sellingPoints: modalEditedProject.sellingPoints,
        selling_points: modalEditedProject.sellingPoints,
        keywords: modalEditedProject.keywords,
      };

      localStorage.setItem(
        `project_details_${project.id}`,
        JSON.stringify(dataToSave),
      );

      // Update display project
      setDisplayProject({ ...project, ...dataToSave });

      console.log("Saving slideout project data to localStorage:", dataToSave);
    }
    setIsEditSlideoutOpen(false);
  };

  const handleSlideoutCancel = () => {
    setModalEditedProject(project);
    setIsEditSlideoutOpen(false);
  };

  const handleOpenEditSlideout = () => {
    // Use displayProject (which includes localStorage data) for editing
    setModalEditedProject({
      ...displayProject,
      targetAudience:
        displayProject.target_audience || displayProject.targetAudience,
      targetAudienceGroups:
        displayProject.target_audience_groups ||
        displayProject.targetAudienceGroups,
      sellingPoints:
        displayProject.selling_points || displayProject.sellingPoints,
    });
    setIsEditSlideoutOpen(true);
  };

  // KI-Texte generieren handlers
  const handleOpenAiModal = () => {
    setIsAiModalOpen(true);
  };

  const handleApplyGeneratedTexts = (texts: any) => {
    // Save AI-generated texts to localStorage
    if (project?.id && texts) {
      const dataToSave = {
        description: texts.description || displayProject.description,
        genres: texts.genres || displayProject.genres,
        slogan: texts.slogan || displayProject.slogan,
        targetAudience: texts.targetAudience || displayProject.target_audience,
        target_audience: texts.targetAudience || displayProject.target_audience,
        targetAudienceGroups:
          texts.targetAudienceGroups || displayProject.target_audience_groups,
        target_audience_groups:
          texts.targetAudienceGroups || displayProject.target_audience_groups,
        sellingPoints: texts.sellingPoints || displayProject.selling_points,
        selling_points: texts.sellingPoints || displayProject.selling_points,
        keywords: Array.isArray(texts.keywords)
          ? texts.keywords.join(", ")
          : texts.keywords || displayProject.keywords,
      };

      // Handle title if provided
      if (texts.selectedTitle) {
        dataToSave.title = texts.selectedTitle.title;
        dataToSave.subtitle = texts.selectedTitle.subtitle;
      }

      localStorage.setItem(
        `project_details_${project.id}`,
        JSON.stringify(dataToSave),
      );

      // Update display project
      setDisplayProject({ ...project, ...dataToSave });

      console.log("Applying generated texts to localStorage:", dataToSave);
    }
  };

  return (
    <>
      {/* Project Details Card */}

      <Card className="shadow-sm rounded-xl border-gray-200">
        <CardHeader className="pb-4 border-b border-gray-200">
          <CardTitle className="flex justify-between items-center text-xl font-bold text-gray-900">
            <div className="flex items-center">Über dieses Buch</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-300 hover:bg-purple-50 w-full sm:w-auto"
                onClick={handleOpenAiModal}
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Texte erstellen lassen</span>
                <span className="sm:hidden">KI-Texte</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenEditSlideout}
                size="sm"
                className="w-full sm:w-auto"
              >
                <EditIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Bearbeiten</span>
                <span className="sm:hidden">Bearbeiten</span>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-gray-700">
              {displayProject.description || (
                <span className="text-muted-foreground italic">
                  Keine Beschreibung vorhanden
                </span>
              )}
            </p>
          </div>

          {/* Marketing Data */}
          <>
            {displayProject.slogan && (
              <div className="mt-6">
                <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl mb-8">
                  <div className="flex items-center justify-center gap-3">
                    <QuoteIcon className="h-6 w-6 text-gray-400" />
                    <p className="text-xl font-semibold text-center italic text-gray-800">
                      {displayProject.slogan}
                    </p>
                    <QuoteIcon className="h-6 w-6 text-gray-400 rotate-180" />
                  </div>
                </div>
              </div>
            )}

            {/* Genres Section */}
            {Array.isArray(displayProject.genres) &&
              displayProject.genres.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-base text-gray-800 mb-4">
                    Genres
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {displayProject.genres.map(
                      (genre: string, index: number) => {
                        const genreLabel = getGenreLabel(genre);
                        return (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 px-3 py-1"
                            title={genre}
                          >
                            {genreLabel}
                          </Badge>
                        );
                      },
                    )}
                  </div>
                </div>
              )}

            {(displayProject.target_audience ||
              displayProject.targetAudience) && (
              <div className="mt-8">
                <h4 className="font-semibold text-base text-gray-800 mb-4 flex items-center">
                  Für wen eignet sich dieses Buch
                </h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {displayProject.target_audience ||
                    displayProject.targetAudience}
                </p>

                {Array.isArray(
                  displayProject.target_audience_groups ||
                    displayProject.targetAudienceGroups,
                ) &&
                  (
                    displayProject.target_audience_groups ||
                    displayProject.targetAudienceGroups
                  ).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(
                        displayProject.target_audience_groups ||
                        displayProject.targetAudienceGroups
                      ).map((group: string, index: number) => {
                        const groupLabel = getTargetAudienceLabel(group);
                        return (
                          <Badge
                            key={index}
                            className="bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 px-3 py-1"
                            title={group}
                          >
                            {groupLabel}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
              </div>
            )}

            {(displayProject.selling_points ||
              displayProject.sellingPoints) && (
              <div className="mt-8">
                <h4 className="font-semibold text-base text-gray-800 mb-4 flex items-center">
                  Highlights
                </h4>
                <div className="space-y-3">
                  {(() => {
                    const sellingPointsData =
                      displayProject.selling_points ||
                      displayProject.sellingPoints;
                    const sellingPoints = Array.isArray(sellingPointsData)
                      ? sellingPointsData
                      : (sellingPointsData || "")
                          .split(",")
                          .map((p: string) => p.trim())
                          .filter((p: string) => p.length > 0);

                    return sellingPoints.map((point: string, index: number) => (
                      <div key={index} className="flex items-start p-2">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">
                          {point}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* Keywords Section */}
            {displayProject.keywords && (
              <div className="mt-8">
                <h4 className="font-semibold text-base text-gray-800 mb-4 flex items-center">
                  Unter diesen Begriffen findet man dieses Buch
                </h4>
                <div className="flex flex-wrap gap-2">
                  {displayProject.keywords
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

      {/* Edit Slideout */}
      <Sheet open={isEditSlideoutOpen} onOpenChange={setIsEditSlideoutOpen}>
        <SheetContent
          className="w-full sm:w-[800px] sm:max-w-[800px] overflow-y-auto"
          side="right"
        >
          <SheetHeader className="px-4 sm:px-6 text-left">
            <SheetTitle className="text-lg sm:text-xl text-left">
              Vermarktungsdaten bearbeiten
            </SheetTitle>
            <SheetDescription className="text-sm sm:text-base text-left">
              Bearbeite die Vermarktungsdaten für dein Buchprojekt.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 mt-8">
            {/* Description */}
            <div className="space-y-3">
              <Label
                htmlFor="modal-description"
                className="text-sm font-medium text-gray-900"
              >
                Beschreibung
              </Label>
              <Textarea
                id="modal-description"
                name="description"
                value={modalEditedProject?.description || ""}
                onChange={handleModalInputChange}
                placeholder="Beschreibe dein Buch in wenigen Sätzen..."
                rows={4}
                className="text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {/* Genres */}
            <div className="space-y-3">
              <Label
                htmlFor="modal-genres"
                className="text-sm font-medium text-gray-900"
              >
                Genre(s)
              </Label>
              <TreeSelect
                options={genreOptionsData}
                selected={
                  Array.isArray(modalEditedProject?.genres)
                    ? modalEditedProject.genres
                    : []
                }
                onChange={(values) => handleModalSelectChange("genres", values)}
                placeholder="Wähle passende Genres aus..."
              />
            </div>

            {/* Slogan */}
            <div className="space-y-3">
              <Label
                htmlFor="modal-slogan"
                className="text-sm font-medium text-gray-900"
              >
                Slogan
              </Label>
              <Input
                id="modal-slogan"
                name="slogan"
                value={modalEditedProject?.slogan || ""}
                onChange={handleModalInputChange}
                placeholder="z.B. 'Vom Manuskript zum Marktführer'"
                className="text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-3">
              <Label
                htmlFor="modal-targetAudience"
                className="text-sm font-medium text-gray-900"
              >
                Zielgruppe
              </Label>
              <Textarea
                id="modal-targetAudience"
                name="targetAudience"
                value={modalEditedProject?.targetAudience || ""}
                onChange={handleModalInputChange}
                placeholder="z.B. 'Angehende Self-Publisher und erfahrene Autoren'"
                rows={2}
                className="text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {/* Target Audience Groups */}
            <div className="space-y-3">
              <Label
                htmlFor="modal-targetAudienceGroups"
                className="text-sm font-medium text-gray-900"
              >
                Zielgruppen-Klassifikation (optional)
              </Label>
              <p className="text-sm text-gray-600 mb-2">
                Grenze deine Leser weiter nach besonderen Interessengruppen oder
                Altersempfehlungen ein
              </p>
              <TreeSelect
                options={targetAudienceOptions}
                selected={
                  Array.isArray(modalEditedProject?.targetAudienceGroups)
                    ? modalEditedProject.targetAudienceGroups
                    : []
                }
                onChange={(values) =>
                  handleModalSelectChange("targetAudienceGroups", values)
                }
                placeholder="Wähle spezifische Zielgruppen aus..."
              />
            </div>

            {/* Selling Points */}
            <div className="space-y-3">
              <Label
                htmlFor="modal-sellingPoints"
                className="text-sm font-medium text-gray-900"
              >
                Kaufargumente
              </Label>
              <div className="space-y-3">
                {(() => {
                  const sellingPoints = modalEditedProject?.sellingPoints
                    ? typeof modalEditedProject.sellingPoints === "string"
                      ? modalEditedProject.sellingPoints
                          .split(",")
                          .map((p: string) => p.trim())
                          .filter((p: string) => p.length > 0)
                      : Array.isArray(modalEditedProject.sellingPoints)
                        ? modalEditedProject.sellingPoints
                        : []
                    : [""];

                  return sellingPoints.map((point: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={point}
                        onChange={(e) => {
                          const newPoints = [...sellingPoints];
                          newPoints[index] = e.target.value;
                          handleModalSelectChange(
                            "sellingPoints",
                            newPoints.filter((p) => p.trim().length > 0),
                          );
                        }}
                        placeholder={`z.B. 'Praxiserprobte Strategien'`}
                        className="flex-1 text-gray-700 placeholder:text-gray-400"
                      />
                      {sellingPoints.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newPoints = sellingPoints.filter(
                              (_: string, i: number) => i !== index,
                            );
                            handleModalSelectChange(
                              "sellingPoints",
                              newPoints.filter((p) => p.trim().length > 0),
                            );
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ));
                })()}
                {(() => {
                  const sellingPoints = modalEditedProject?.sellingPoints
                    ? typeof modalEditedProject.sellingPoints === "string"
                      ? modalEditedProject.sellingPoints
                          .split(",")
                          .map((p: string) => p.trim())
                          .filter((p: string) => p.length > 0)
                      : Array.isArray(modalEditedProject.sellingPoints)
                        ? modalEditedProject.sellingPoints
                        : []
                    : [""];

                  return (
                    sellingPoints.length < 5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newPoints = [...sellingPoints, ""];
                          handleModalSelectChange("sellingPoints", newPoints);
                        }}
                        className="w-fit mx-auto bg-gray-50 hover:bg-gray-100 border-dashed border-2 text-gray-600 hover:text-gray-700"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Kaufargument hinzufügen
                      </Button>
                    )
                  );
                })()}
              </div>
              <p className="text-xs text-gray-500">
                Gib 1-5 kurze Kaufargumente ein (z.B. "Praxisnah", "Leicht
                verständlich")
              </p>
            </div>

            {/* Keywords */}
            <div className="space-y-3">
              <Label
                htmlFor="modal-keywords"
                className="text-sm font-medium text-gray-900"
              >
                Suchbegriffe
              </Label>
              <Textarea
                id="modal-keywords"
                name="keywords"
                value={modalEditedProject?.keywords || ""}
                onChange={handleModalInputChange}
                placeholder="z.B. 'Self-Publishing, Buchvermarktung, Print-on-Demand'"
                rows={3}
                className="text-gray-700 placeholder:text-gray-400 sm:rows-2"
              />
            </div>
          </div>
          <SheetFooter className="mt-4 sm:mt-6 px-4 sm:px-6 flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleSlideoutCancel}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              <XIcon className="h-4 w-4 mr-2" />
              Abbrechen
            </Button>
            <Button
              onClick={handleSlideoutSave}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* KI-Texte generieren Modal */}
      <AITextGenerationModal
        isOpen={isAiModalOpen}
        onOpenChange={setIsAiModalOpen}
        project={project}
        onApplyTexts={handleApplyGeneratedTexts}
      />

      {/* Author, Series, and Publisher Information */}
      <AuthorPublisherSection
        project={project}
        projectAuthors={projectAuthors}
        onAuthorOrderChange={onAuthorOrderChange}
        onRemoveAuthor={onRemoveAuthor}
      />
    </>
  );
};

export default ProjectDetails;
