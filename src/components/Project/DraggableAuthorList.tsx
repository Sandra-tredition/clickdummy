import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trash2Icon,
  GripVertical,
  Edit,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Author {
  id: string;
  author_id: string;
  author_role: string;
  biography_id: string | null;
  display_order: number | null;
  authors: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    author_type: string;
  };
  author_biographies: {
    id: string;
    biography_text: string;
    biography_label?: string;
    language?: string;
  } | null;
}

interface DraggableAuthorListProps {
  authors: Author[];
  onOrderChange: (authors: Author[]) => void;
  onRemove: (authorId: string) => void;
  onEditBasicData?: (authorId: string) => void;
  onEditProjectBiography?: (projectAuthor: Author) => void;
  projectId?: string;
}

const DraggableAuthorList: React.FC<DraggableAuthorListProps> = ({
  authors,
  onOrderChange,
  onRemove,
  onEditBasicData,
  onEditProjectBiography,
  projectId,
}) => {
  const [draggedAuthorId, setDraggedAuthorId] = useState<string | null>(null);
  const [expandedBiographies, setExpandedBiographies] = useState<Set<string>>(
    new Set(),
  );

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    authorId: string,
  ) => {
    setDraggedAuthorId(authorId);
    e.dataTransfer.effectAllowed = "move";
    // Add a ghost image to make dragging more visible
    const draggedElement = e.currentTarget;
    if (draggedElement) {
      e.dataTransfer.setDragImage(draggedElement, 20, 20);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-muted/50");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("bg-muted/50");
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetAuthorId: string,
  ) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-muted/50");

    if (!draggedAuthorId || draggedAuthorId === targetAuthorId) return;

    const draggedIndex = authors.findIndex(
      (author) => author.id === draggedAuthorId,
    );
    const targetIndex = authors.findIndex(
      (author) => author.id === targetAuthorId,
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create a new array with the reordered authors
    const newAuthors = [...authors];
    const [draggedAuthor] = newAuthors.splice(draggedIndex, 1);
    newAuthors.splice(targetIndex, 0, draggedAuthor);

    // Update display_order for all authors
    const updatedAuthors = newAuthors.map((author, index) => ({
      ...author,
      display_order: index,
    }));

    onOrderChange(updatedAuthors);
    setDraggedAuthorId(null);
  };

  const handleDragEnd = () => {
    setDraggedAuthorId(null);
  };

  const toggleBiographyExpansion = (authorId: string) => {
    setExpandedBiographies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(authorId)) {
        newSet.delete(authorId);
      } else {
        newSet.add(authorId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-3">
      {authors.map((author) => (
        <div
          key={author.id}
          className={`group relative bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all ${draggedAuthorId === author.id ? "opacity-50" : ""}`}
          draggable
          onDragStart={(e) => handleDragStart(e, author.id)}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, author.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="flex items-start gap-4 p-4">
            <div className="cursor-grab mt-1">
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-base font-semibold text-gray-800 truncate">
                  {author.authors.author_type === "person"
                    ? `${author.authors.first_name || ""} ${author.authors.last_name || ""}`.trim()
                    : author.authors.company_name}
                </h3>
                <Badge variant="outline" className="text-xs font-normal">
                  {author.author_role}
                </Badge>
              </div>

              {author.author_biographies?.biography_text &&
              author.author_biographies.biography_text !==
                "Keine Biografie vorhanden." ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {author.author_biographies.biography_label ===
                    "Projektbezogen" ? (
                      <Badge
                        variant="secondary"
                        className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-normal"
                      >
                        Projektbezogen
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-normal"
                      >
                        Standard
                      </Badge>
                    )}
                  </div>
                  <div className="relative">
                    <p
                      className={`text-sm text-gray-600 leading-relaxed ${
                        expandedBiographies.has(author.id) ? "" : "line-clamp-3"
                      }`}
                    >
                      {author.author_biographies.biography_text}
                    </p>
                    {author.author_biographies.biography_text.length > 200 && (
                      <button
                        onClick={() => toggleBiographyExpansion(author.id)}
                        className="mt-1 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
                      >
                        {expandedBiographies.has(author.id) ? (
                          <>
                            <ChevronUp className="h-3 w-3" />
                            Weniger anzeigen
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3" />
                            Mehr anzeigen
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-gray-50 text-gray-600 border-gray-200 text-xs font-normal"
                  >
                    Ohne Biografie
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2 min-w-0">
              <div className="flex items-center gap-2">
                {onEditBasicData && (
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => onEditBasicData(author.author_id)}
                    className="h-9 px-3 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Grunddaten
                  </Button>
                )}
                {/* Biography edit button - different behavior based on biography type */}
                {author.author_biographies?.biography_label ===
                "Projektbezogen" ? (
                  // Project-specific biography - edit in dialog
                  onEditProjectBiography && (
                    <Button
                      variant="ghost"
                      size="default"
                      onClick={() => onEditProjectBiography(author)}
                      className="h-9 px-3 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Biografie
                    </Button>
                  )
                ) : (
                  // Standard biography or no biography - link to author page
                  <Button
                    variant="ghost"
                    size="default"
                    asChild
                    className="h-9 px-3 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Link
                      to={`/authors/${author.author_id}${projectId ? `?from=project-${projectId}` : ""}`}
                      onClick={() => {
                        if (projectId) {
                          localStorage.setItem(
                            "authorPageNavigation",
                            JSON.stringify({
                              from: `/project/${projectId}`,
                              timestamp: Date.now(),
                            }),
                          );
                        }
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Biografie
                    </Link>
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="default"
                onClick={() => onRemove(author.id)}
                className="text-gray-400 hover:text-red-600 h-9 w-9 p-0"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DraggableAuthorList;
