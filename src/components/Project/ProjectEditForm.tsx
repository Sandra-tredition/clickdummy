import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { TreeSelect, TreeNode } from "@/components/ui/treeselect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircleIcon,
  PlusIcon,
  SaveIcon,
  ArrowUpDownIcon,
  CheckIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DraggableAuthorList from "@/components/Project/DraggableAuthorList";

interface ProjectEditFormProps {
  editedProject: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
  seriesList: any[];
  genreOptions: any[];
  projectAuthors: any[];
  reorderingAuthors: boolean;
  setReorderingAuthors: (value: boolean) => void;
  handleRemoveAuthorFromProject: (authorId: string) => void;
  setIsAuthorDialogOpen: (isOpen: boolean) => void;
  setIsNewAuthorDialogOpen: (isOpen: boolean) => void;
  setIsNewSeriesDialogOpen: (isOpen: boolean) => void;
  handleEditToggle: () => void;
  project: any;
}

const ProjectEditForm: React.FC<ProjectEditFormProps> = ({
  editedProject,
  handleInputChange,
  handleSelectChange,
  seriesList,
  genreOptions,
  projectAuthors,
  reorderingAuthors,
  setReorderingAuthors,
  handleRemoveAuthorFromProject,
  setIsAuthorDialogOpen,
  setIsNewAuthorDialogOpen,
  setIsNewSeriesDialogOpen,
  handleEditToggle,
  project,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projektdetails bearbeiten</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="title">Titel *</Label>
              </div>
              <Input
                id="title"
                name="title"
                value={editedProject.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Untertitel</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={editedProject.subtitle}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="languages">Sprache(n) *</Label>
                <div className="relative group">
                  <AlertCircleIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="invisible group-hover:visible absolute z-50 p-2 bg-black text-white text-xs rounded w-64 -top-2 left-6">
                    Wähle die Sprache aus, in der dein Buch geschrieben ist.
                    Mehrfachnennungen sind möglich, wenn es sich bei deinem Buch
                    um einen mehrsprachigen Inhalt handelt.
                  </div>
                </div>
              </div>
              <div className="mt-1">
                <MultiSelect
                  popoverProps={{ align: "start" }}
                  options={[
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
                  ]}
                  selected={
                    Array.isArray(editedProject.languages)
                      ? editedProject.languages
                      : []
                  }
                  onChange={(values) => {
                    handleSelectChange("languages", values);
                  }}
                  placeholder="Sprachen auswählen"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="series">Reihe</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    value={editedProject.series || "none"}
                    onValueChange={(value) => {
                      console.log("Series select changed to:", value);
                      handleSelectChange(
                        "series",
                        value === "none" ? "" : value,
                      );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Reihe auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Keine Reihe</SelectItem>
                      {seriesList.map((series) => (
                        <SelectItem key={series.id} value={series.id}>
                          {series.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsNewSeriesDialogOpen(true)}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisher">Verlag</Label>
              <Input
                id="publisher"
                name="publisher"
                value={editedProject.publisher}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="genres">Genre(s) *</Label>
                <div className="relative group">
                  <AlertCircleIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="invisible group-hover:visible absolute z-50 p-2 bg-black text-white text-xs rounded w-64 -top-2 left-6">
                    Wähle ein oder mehrere Genres für dein Buch aus. Du kannst
                    auch Unterkategorien auswählen.
                  </div>
                </div>
              </div>
              <TreeSelect
                options={genreOptions}
                selected={
                  Array.isArray(editedProject.genres)
                    ? editedProject.genres
                    : []
                }
                onChange={(values) => {
                  handleSelectChange("genres", values);
                }}
                placeholder="Genres auswählen"
              />
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="targetAudience">Zielgruppe *</Label>
                <div className="relative group">
                  <AlertCircleIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="invisible group-hover:visible absolute z-50 p-2 bg-black text-white text-xs rounded w-64 -top-2 left-6">
                    Beschreibe die Zielgruppe für dein Buch.
                  </div>
                </div>
              </div>
              <Textarea
                id="targetAudience"
                name="targetAudience"
                value={editedProject.targetAudience}
                onChange={handleInputChange}
                placeholder="Beschreibe deine Zielgruppe"
                rows={2}
              />
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="targetAudienceGroups">
                  Zielgruppen-Klassifikation *
                </Label>
                <div className="relative group">
                  <AlertCircleIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="invisible group-hover:visible absolute z-50 p-2 bg-black text-white text-xs rounded w-64 -top-2 left-6">
                    Wähle eine oder mehrere Klassifikationen für deine
                    Zielgruppe aus.
                  </div>
                </div>
              </div>
              <MultiSelect
                options={[
                  { value: "Kinder", label: "Kinder" },
                  { value: "Jugendliche", label: "Jugendliche" },
                  {
                    value: "Junge Erwachsene",
                    label: "Junge Erwachsene",
                  },
                  { value: "Erwachsene", label: "Erwachsene" },
                  { value: "Senioren", label: "Senioren" },
                  { value: "Frauen", label: "Frauen" },
                  { value: "Männer", label: "Männer" },
                  { value: "Akademiker", label: "Akademiker" },
                  { value: "Fachpublikum", label: "Fachpublikum" },
                  { value: "Hobbyisten", label: "Hobbyisten" },
                  { value: "Anfänger", label: "Anfänger" },
                  {
                    value: "Fortgeschrittene",
                    label: "Fortgeschrittene",
                  },
                  { value: "Experten", label: "Experten" },
                ]}
                selected={
                  Array.isArray(editedProject.targetAudienceGroups)
                    ? editedProject.targetAudienceGroups
                    : []
                }
                onChange={(values) => {
                  handleSelectChange("targetAudienceGroups", values);
                }}
                placeholder="Zielgruppen auswählen"
              />
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="slogan">Slogan *</Label>
                <div className="relative group">
                  <AlertCircleIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="invisible group-hover:visible absolute z-50 p-2 bg-black text-white text-xs rounded w-64 -top-2 left-6">
                    Ein kurzer, prägnanter Slogan für dein Buch.
                  </div>
                </div>
              </div>
              <Input
                id="slogan"
                name="slogan"
                value={editedProject.slogan}
                onChange={handleInputChange}
                placeholder="Kurzer, prägnanter Slogan"
              />
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="sellingPoints">Kaufargumente *</Label>
                <div className="relative group">
                  <AlertCircleIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="invisible group-hover:visible absolute z-50 p-2 bg-black text-white text-xs rounded w-64 -top-2 left-6">
                    Stichpunktartige Begriffe, die als Kaufargumente dienen.
                  </div>
                </div>
              </div>
              <Textarea
                id="sellingPoints"
                name="sellingPoints"
                value={editedProject.sellingPoints}
                onChange={handleInputChange}
                placeholder="Stichpunktartige Kaufargumente (z.B. 'Praxisnah, Leicht verständlich, Umfassend')"
                rows={2}
              />
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="keywords">Schlagworte *</Label>
                <div className="relative group">
                  <AlertCircleIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="invisible group-hover:visible absolute z-50 p-2 bg-black text-white text-xs rounded w-64 -top-2 left-6">
                    Begriffe, nach denen ein Leser typischerweise suchen würde.
                  </div>
                </div>
              </div>
              <Textarea
                id="keywords"
                name="keywords"
                value={editedProject.keywords}
                onChange={handleInputChange}
                placeholder="Suchbegriffe, durch Kommas getrennt"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Diese Schlagworte werden in der Suchleiste über dem Cover
                angezeigt.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="authors" className="text-sm font-medium">
                Urheber*
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReorderingAuthors(!reorderingAuthors)}
                >
                  {reorderingAuthors ? (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Reihenfolge speichern
                    </>
                  ) : (
                    <>
                      <ArrowUpDownIcon className="h-4 w-4 mr-2" />
                      Reihenfolge ändern
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("Opening author dialog");
                    setIsAuthorDialogOpen(true);
                  }}
                  disabled={reorderingAuthors}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Vorhandenen Urheber zuordnen
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // Öffne Dialog zum Erstellen eines neuen Urhebers
                    setIsNewAuthorDialogOpen(true);
                  }}
                  disabled={reorderingAuthors}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Neuen Urheber anlegen
                </Button>
              </div>
            </div>

            {projectAuthors.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-lg">
                <UserIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Füge Urheber zu diesem Projekt hinzu, um Autoren,
                  Illustratoren und andere Mitwirkende zu verwalten.
                </p>
              </div>
            ) : reorderingAuthors ? (
              <DraggableAuthorList
                authors={projectAuthors}
                onOrderChange={(updatedAuthors) => {
                  // This will be handled by the parent component
                }}
                onRemove={handleRemoveAuthorFromProject}
              />
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Rolle</TableHead>
                      <TableHead>Biografie</TableHead>
                      <TableHead className="w-[80px]">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectAuthors.map((pa) => (
                      <TableRow key={pa.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                              {pa.display_order !== undefined
                                ? pa.display_order
                                : 0}
                            </div>
                            <div className="font-medium">
                              {pa.authors.author_type === "person"
                                ? `${pa.authors.last_name}, ${pa.authors.first_name || ""}`
                                : pa.authors.company_name}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {pa.authors.author_type === "person"
                              ? "Person"
                              : "Körperschaft"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{pa.author_role}</Badge>
                        </TableCell>
                        <TableCell>
                          {pa.author_biographies &&
                          pa.author_biographies.biography_text ? (
                            <div className="max-w-xs truncate">
                              {pa.author_biographies.biography_text}
                              {pa.author_biographies.language && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ({pa.author_biographies.language})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Keine Biografie
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAuthorFromProject(pa.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="description">Beschreibung *</Label>
            </div>
            <Textarea
              id="description"
              name="description"
              value={editedProject.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            // Check if we have a cancel handler prop, otherwise use the toggle
            if (typeof window !== "undefined" && window.handleCancelEdit) {
              window.handleCancelEdit();
            } else {
              handleEditToggle();
            }
          }}
        >
          Abbrechen
        </Button>
        <Button onClick={handleEditToggle}>
          <SaveIcon className="h-4 w-4 mr-2" />
          Änderungen speichern
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectEditForm;
