import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  BookIcon,
  Grid,
  List,
} from "lucide-react";
import ProjectCard from "./ProjectCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Project {
  id: string;
  title: string;
  coverImage: string;
  language: string;
  lastEdited: string;
  editionCount?: number;
}

interface ProjectGridProps {
  projects?: Project[];
  onCreateProject?: () => void;
}

const ProjectGrid = ({
  projects = [],
  onCreateProject = () => console.log("Create new project"),
}: ProjectGridProps) => {
  // Ensure projects is always an array
  const safeProjects = Array.isArray(projects) ? projects : [];
  const [searchTerm, setSearchTerm] = useState("");

  const [sortBy, setSortBy] = useState("lastEdited");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter projects based on search term
  const filteredProjects = safeProjects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Sort projects based on selected sort option
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "language") {
      return a.language.localeCompare(b.language);
    } else {
      // Default sort by lastEdited (most recent first)
      return (
        new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
      );
    }
  });

  return (
    <div className="w-full bg-background">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Projekte suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <div className="w-40">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastEdited">Zuletzt bearbeitet</SelectItem>
                <SelectItem value="title">Titel</SelectItem>
                <SelectItem value="language">Sprache</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      {sortedProjects.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProjects.map((project) => (
              <div key={project.id} className="w-full">
                <ProjectCard
                  id={project.id}
                  title={project.title}
                  coverImage={project.coverImage}
                  language={project.language}
                  lastEdited={project.lastEdited}
                  editionCount={project.editionCount}
                  onView={(id) => (window.location.href = `/project/${id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
                onClick={() =>
                  (window.location.href = `/project/${project.id}`)
                }
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-500">
                    Zuletzt bearbeitet: {project.lastEdited}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-base text-muted-foreground mb-4">
            Keine Projekte gefunden
          </div>
          <Button variant="outline" onClick={onCreateProject}>
            Erstelle dein erstes Projekt
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectGrid;
