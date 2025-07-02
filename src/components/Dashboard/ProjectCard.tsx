import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  id: string;
  title: string;
  coverImage: string;
  language: string;
  lastEdited: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const ProjectCard = ({
  id = "1",
  title = "Untitled Project",
  coverImage = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80",
  language = "Deutsch",
  lastEdited = "2023-04-15",
  onEdit,
  onDelete,
  onView,
}: ProjectCardProps) => {
  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
      case "deutsch":
        return "bg-blue-500";
      case "english":
        return "bg-green-500";
      case "français":
      case "french":
        return "bg-purple-500";
      case "español":
      case "spanish":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleEdit = () => onEdit && onEdit(id);
  const handleDelete = () => onDelete && onDelete(id);
  const handleView = () => {
    if (onView) {
      onView(id);
    } else {
      window.location.href = `/project/${id}`;
    }
  };

  return (
    <Card
      className="w-full h-[400px] overflow-hidden flex flex-col bg-white cursor-pointer transition-all hover:shadow-lg"
      onClick={handleView}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-contain"
        />
        <div className="absolute top-2 right-2">
          <Badge className={`${getLanguageColor(language)} text-white`}>
            {language}
          </Badge>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-semibold line-clamp-2 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          Zuletzt bearbeitet: {lastEdited}
        </p>

        <div className="mt-auto flex justify-center items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleView();
            }}
            className="flex items-center gap-1 w-full"
          >
            <Eye className="h-4 w-4" /> Öffnen
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
