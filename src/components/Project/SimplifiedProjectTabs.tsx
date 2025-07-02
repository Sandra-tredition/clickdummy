import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SimplifiedProjectTabsProps {
  project: any;
}

const SimplifiedProjectTabs: React.FC<SimplifiedProjectTabsProps> = ({
  project,
}) => {
  return (
    <Tabs
      defaultValue="details"
      className="w-full bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <TabsList className="grid grid-cols-3 mb-0 p-1 bg-gray-50 border-b">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="editions">Ausgaben</TabsTrigger>
        <TabsTrigger value="metadata">Metadaten</TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Produktdetails</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Format</h3>
              <p className="mt-1">
                {project.editions?.[0]?.produktform ||
                  "Verschiedene Formate verfügbar"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sprache</h3>
              <p className="mt-1">
                {Array.isArray(project.languages)
                  ? project.languages.join(", ")
                  : "Deutsch"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Seitenzahl</h3>
              <p className="mt-1">
                {project.editions?.[0]?.pages || "--"} Seiten
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">ISBN</h3>
              <p className="mt-1">
                {project.editions?.[0]?.isbn || "Noch nicht vergeben"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(project.genres) && project.genres.length > 0 ? (
                project.genres.map((genre: string, index: number) => (
                  <Badge key={index} variant="secondary" className="capitalize">
                    {genre.split(".").pop() || genre}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-400">Keine Genres angegeben</span>
              )}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="editions" className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Verfügbare Ausgaben</h2>
          {project.editions && project.editions.length > 0 ? (
            <div className="space-y-3">
              {project.editions.map((edition: any) => (
                <div
                  key={edition.id}
                  className="p-4 border rounded-md hover:bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{edition.produktform}</div>
                    <div className="text-sm text-gray-500">
                      {edition.ausgabenart || "Standardausgabe"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {edition.price
                        ? `${edition.price.toFixed(2)} €`
                        : "--,-- €"}
                    </div>
                    <Badge
                      variant={
                        edition.status === "Ready" ? "default" : "outline"
                      }
                      className={
                        edition.status === "Ready"
                          ? "bg-green-600"
                          : "border-amber-500 text-amber-500"
                      }
                    >
                      {edition.status === "Ready"
                        ? "Veröffentlicht"
                        : "Entwurf"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Keine Ausgaben verfügbar.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="metadata" className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Metadaten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Projekt-ID</h3>
              <p className="mt-1 font-mono text-sm">{project.id || "--"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Erstellt am</h3>
              <p className="mt-1">
                {project.created_at
                  ? new Date(project.created_at).toLocaleDateString()
                  : "--"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Zuletzt bearbeitet
              </h3>
              <p className="mt-1">
                {project.lastEdited &&
                !isNaN(new Date(project.lastEdited).getTime())
                  ? new Date(project.lastEdited).toLocaleDateString()
                  : "--"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1 flex items-center">
                <Badge
                  className={
                    project.editions?.some((e: any) => e.status === "Ready")
                      ? "bg-green-600"
                      : "bg-amber-500"
                  }
                >
                  {project.editions?.some((e: any) => e.status === "Ready")
                    ? "Veröffentlicht"
                    : "Entwurf"}
                </Badge>
              </p>
            </div>
          </div>

          {project.keywords && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Schlagworte</h3>
              <div className="flex flex-wrap gap-2">
                {project.keywords
                  .split(",")
                  .map((keyword: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-100 hover:bg-gray-200"
                    >
                      {keyword.trim()}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SimplifiedProjectTabs;
