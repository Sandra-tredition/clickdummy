import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  CheckCircleIcon,
  EditIcon,
  EyeIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import useEmblaCarousel from "embla-carousel-react";

interface ProjectCoverProps {
  project: any;
  editions: any[];
  isEditing: boolean;
  editedProject: any;
  setEditedProject: (project: any) => void;
  isProjectReadyForPublishing: () => boolean;
  setIsAddEditionDialogOpen: (isOpen: boolean) => void;
  setEditions: (editions: any[]) => void;
}

const ProjectCover: React.FC<ProjectCoverProps> = ({
  project,
  editions,
  isEditing,
  editedProject,
  setEditedProject,
  isProjectReadyForPublishing,
  setIsAddEditionDialogOpen,
  setEditions,
}) => {
  // Search bar component with integrated keyword badges
  const SearchBar = () => (
    <div className="mb-4 w-full">
      <div className="relative">
        <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
          <div className="p-2 bg-gray-50 border-r">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <div className="flex-1 flex items-center flex-wrap gap-1 p-2">
            {project.keywords ? (
              project.keywords
                .split(",")
                .map((keyword: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {keyword.trim()}
                  </Badge>
                ))
            ) : (
              <span className="text-sm text-gray-400">
                Nach Büchern suchen...
              </span>
            )}
          </div>
          {isEditing ? (
            <button
              className="p-2 text-primary hover:text-primary/80"
              onClick={() => {
                // Open keywords editor
                const newKeywords = prompt(
                  "Schlagworte bearbeiten (durch Kommas getrennt):",
                  editedProject.keywords,
                );
                if (newKeywords !== null) {
                  setEditedProject((prev: any) => ({
                    ...prev,
                    keywords: newKeywords,
                  }));
                }
              }}
            >
              <EditIcon className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );

  // Cover with editions
  const CoverWithEditions = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollPrev = useCallback(() => {
      if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
      if (!emblaApi) return;
      setCurrentIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    React.useEffect(() => {
      if (!emblaApi) return;
      onSelect();
      emblaApi.on("select", onSelect);
    }, [emblaApi, onSelect]);

    const currentEdition = editions[currentIndex] || editions[0];

    return (
      <div className="sticky top-4">
        <div className="relative">
          <div className="rounded-lg overflow-hidden shadow-lg border border-gray-100">
            {editions.length > 1 ? (
              <div className="embla" ref={emblaRef}>
                <div className="embla__container flex">
                  {editions.map((edition, index) => (
                    <div
                      key={edition.id}
                      className="embla__slide flex-[0_0_100%] min-w-0"
                    >
                      {edition.cover_image ? (
                        <img
                          src={edition.cover_image}
                          alt={`${project.title} - ${edition.produktform}`}
                          className="w-full h-auto object-cover aspect-[2/3]"
                        />
                      ) : (
                        <div className="w-full aspect-[2/3] bg-gray-100 flex items-center justify-center relative">
                          <div className="text-center text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mx-auto mb-2"
                            >
                              <rect
                                width="18"
                                height="18"
                                x="3"
                                y="3"
                                rx="2"
                                ry="2"
                              />
                              <circle cx="9" cy="9" r="2" />
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                            </svg>
                            <p className="text-sm">Kein Cover</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : currentEdition?.cover_image ? (
              <img
                src={currentEdition.cover_image}
                alt={`${project.title} - ${currentEdition.produktform}`}
                className="w-full h-auto object-cover aspect-[2/3]"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-100 flex items-center justify-center relative">
                <div className="text-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-2"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <p className="text-sm">Kein Cover</p>
                </div>
              </div>
            )}

            {project.series && (
              <div className="absolute top-3 left-0 bg-primary text-white px-3 py-1 text-xs font-medium shadow-md">
                {project.series}
              </div>
            )}

            <div className="absolute top-3 right-3 flex items-center gap-2">
              {isProjectReadyForPublishing() && (
                <div className="bg-green-500 text-white rounded-full p-1 shadow-md">
                  <CheckCircleIcon className="h-4 w-4" />
                </div>
              )}
            </div>

            {editions.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 border border-gray-200"
                  onClick={scrollPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 border border-gray-200"
                  onClick={scrollNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="mt-4">
          {currentEdition?.reading_sample && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Leseprobe</h3>
                <Button variant="outline" size="sm" className="text-xs">
                  <EyeIcon className="h-3 w-3 mr-1" /> Vollständig anzeigen
                </Button>
              </div>
              <div className="prose prose-sm max-h-48 overflow-y-auto bg-gray-50 p-3 rounded text-sm">
                {currentEdition.reading_sample_content || (
                  <p className="text-muted-foreground italic">
                    Leseprobe verfügbar. Klicken Sie auf "Vollständig anzeigen",
                    um die gesamte Leseprobe zu lesen.
                  </p>
                )}
              </div>
            </div>
          )}

          {editions.length > 1 && (
            <div className="mt-4 text-center">
              <div className="inline-block bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium shadow-sm">
                {currentEdition?.produktform}
                {currentEdition?.ausgabenart
                  ? ` • ${currentEdition.ausgabenart}`
                  : ""}
                <span className="ml-2 text-xs text-gray-500">
                  {currentIndex + 1} / {editions.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Cover without editions
  const CoverWithoutEditions = () => (
    <div className="rounded-lg overflow-hidden shadow-lg border border-gray-100">
      {project.coverImage ? (
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-auto object-cover aspect-[2/3]"
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-2"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <p className="text-sm">Kein Cover</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {editions.length > 0 ? <CoverWithEditions /> : <CoverWithoutEditions />}
    </>
  );
};

export default ProjectCover;
