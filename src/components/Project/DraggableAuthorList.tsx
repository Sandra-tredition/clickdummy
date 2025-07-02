import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2Icon, GripVertical } from "lucide-react";

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
    language?: string;
  } | null;
}

interface DraggableAuthorListProps {
  authors: Author[];
  onOrderChange: (authors: Author[]) => void;
  onRemove: (authorId: string) => void;
}

const DraggableAuthorList: React.FC<DraggableAuthorListProps> = ({
  authors,
  onOrderChange,
  onRemove,
}) => {
  const [draggedAuthorId, setDraggedAuthorId] = useState<string | null>(null);

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

  return (
    <div className="space-y-2">
      {authors.map((author) => (
        <div
          key={author.id}
          className={`flex items-center gap-3 p-4 border rounded-lg bg-white ${draggedAuthorId === author.id ? "opacity-50" : ""}`}
          draggable
          onDragStart={(e) => handleDragStart(e, author.id)}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, author.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">
                {author.authors.author_type === "person"
                  ? `${author.authors.last_name}, ${author.authors.first_name || ""}`
                  : author.authors.company_name}
              </h3>
              <Badge variant="outline">{author.author_role}</Badge>
            </div>
            {author.author_biographies?.biography_text &&
            author.author_biographies.biography_text !==
              "Keine Biografie vorhanden." ? (
              <div className="mt-1">
                <p className="text-sm text-muted-foreground">
                  {author.author_biographies.biography_text}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                Keine Biografie zugeordnet
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(author.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default DraggableAuthorList;
