import React, { useState, useEffect } from "react";
import { PlusCircle, Book, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchAllSeries,
  createSeries,
  fetchProjectsBySeries,
  updateSeries,
  removeProjectFromSeries,
  deleteSeries,
} from "@/lib/api/series";
import { Tables } from "@/types/supabase";
import { Link } from "react-router-dom";

type SeriesWithCount = Tables<"series">;
type Project = { id: string; title: string };

interface SeriesProps {
  isEmbedded?: boolean;
}

const SeriesPage = ({ isEmbedded = false }: SeriesProps = {}) => {
  const [series, setSeries] = useState<SeriesWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSeriesName, setNewSeriesName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSeriesId, setEditingSeriesId] = useState<string | null>(null);
  const [seriesProjects, setSeriesProjects] = useState<
    Record<string, Project[]>
  >({});
  const [loadingProjects, setLoadingProjects] = useState<
    Record<string, boolean>
  >({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seriesToDelete, setSeriesToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadSeries = async () => {
      setLoading(true);
      try {
        // Check if current user is the clean user (no mock data)
        const currentUser = JSON.parse(
          localStorage.getItem("currentUser") || "null",
        );
        const isCleanUser = currentUser?.email === "clean@example.com";

        if (isCleanUser) {
          console.log("Clean user detected - no mock series will be shown");
          setSeries([]);
          setLoading(false);
          return;
        }

        const { data, error } = await fetchAllSeries();
        if (error) throw error;

        // Add mock series data for demonstration
        const mockSeries = [
          {
            id: "mock-series-1",
            name: "Fantasy-Saga",
            project_count: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];

        setSeries([...mockSeries, ...(data || [])]);
      } catch (err: any) {
        console.error("Error loading series:", err);
        setError(err.message || "Fehler beim Laden der Buchreihen");
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, []);

  const loadSeriesProjects = async (seriesId: string) => {
    if (!seriesProjects[seriesId]) {
      setLoadingProjects({ ...loadingProjects, [seriesId]: true });
      try {
        // Check if current user is the clean user (no mock data)
        const currentUser = JSON.parse(
          localStorage.getItem("currentUser") || "null",
        );
        const isCleanUser = currentUser?.email === "clean@example.com";

        if (isCleanUser) {
          setSeriesProjects({ ...seriesProjects, [seriesId]: [] });
        } else {
          // Add mock data for demonstration
          if (seriesId === "mock-series-1") {
            setSeriesProjects({
              ...seriesProjects,
              [seriesId]: [
                { id: "mock-project-1", title: "Die Geheimnisse des Waldes" },
                { id: "mock-project-2", title: "Der letzte Magier" },
              ],
            });
          } else {
            const { data, error } = await fetchProjectsBySeries(seriesId);
            if (error) throw error;
            setSeriesProjects({ ...seriesProjects, [seriesId]: data || [] });
          }
        }
      } catch (err) {
        console.error(`Error loading projects for series ${seriesId}:`, err);
      } finally {
        setLoadingProjects({ ...loadingProjects, [seriesId]: false });
      }
    }
  };

  const handleCreateOrUpdateSeries = async () => {
    if (newSeriesName.trim()) {
      try {
        const seriesData = {
          name: newSeriesName,
          ...(editingSeriesId ? {} : { project_count: 0 }),
        };

        let result;
        if (editingSeriesId) {
          result = await updateSeries(editingSeriesId, seriesData);
        } else {
          result = await createSeries(seriesData);
        }

        const { data, error } = result;
        if (error) throw error;

        if (data && data.length > 0) {
          if (editingSeriesId) {
            setSeries(
              series.map((s) => (s.id === editingSeriesId ? data[0] : s)),
            );
          } else {
            setSeries([...series, data[0]]);
          }
        }

        resetForm();
      } catch (err: any) {
        console.error("Error saving series:", err);
        setError(err.message || "Fehler beim Speichern der Buchreihe");
      }
    }
  };

  const resetForm = () => {
    setNewSeriesName("");
    setEditingSeriesId(null);
    setIsDialogOpen(false);
  };

  const handleEditSeries = (item: SeriesWithCount) => {
    setEditingSeriesId(item.id);
    setNewSeriesName(item.name);
    setIsDialogOpen(true);
  };

  const handleRemoveProjectFromSeries = async (
    seriesId: string,
    projectId: string,
  ) => {
    try {
      const { error } = await removeProjectFromSeries(projectId);
      if (error) throw error;

      // Update local state
      const updatedProjects = seriesProjects[seriesId].filter(
        (p) => p.id !== projectId,
      );
      setSeriesProjects({ ...seriesProjects, [seriesId]: updatedProjects });

      // Update series project count
      const updatedSeries = series.map((s) => {
        if (s.id === seriesId) {
          return { ...s, project_count: (s.project_count || 0) - 1 };
        }
        return s;
      });
      setSeries(updatedSeries);
    } catch (err: any) {
      console.error("Error removing project from series:", err);
      setError(
        err.message || "Fehler beim Entfernen des Projekts aus der Buchreihe",
      );
    }
  };

  const handleDeleteSeries = async () => {
    if (!seriesToDelete) return;

    try {
      const { error } = await deleteSeries(seriesToDelete);
      if (error) throw error;

      // Remove from local state
      setSeries(series.filter((s) => s.id !== seriesToDelete));
      setDeleteDialogOpen(false);
      setSeriesToDelete(null);
    } catch (err: any) {
      console.error("Error deleting series:", err);
      setError(err.message || "Fehler beim Löschen der Buchreihe");
    }
  };

  const handleOpenDeleteDialog = (seriesId: string) => {
    setSeriesToDelete(seriesId);
    setDeleteDialogOpen(true);
  };

  const content = (
    <div className="max-w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Buchreihen</h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) resetForm();
            setIsDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <PlusCircle size={18} className="mr-2" />
              Neue Buchreihe anlegen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSeriesId
                  ? "Buchreihe bearbeiten"
                  : "Neue Buchreihe erstellen"}
              </DialogTitle>
              <DialogDescription>
                {editingSeriesId
                  ? "Bearbeiten Sie die Details der Buchreihe."
                  : "Geben Sie einen Namen für die neue Buchreihe ein."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newSeriesName}
                  onChange={(e) => setNewSeriesName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateOrUpdateSeries}>
                {editingSeriesId ? "Speichern" : "Erstellen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <p>Buchreihen werden geladen...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : series.length > 0 ? (
        <div className="space-y-4">
          {series.map((item) => (
            <Card key={item.id} className="w-full border-2 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={item.id} className="border-0">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 min-h-[60px]">
                      <AccordionTrigger className="hover:no-underline flex-shrink-0 self-center"></AccordionTrigger>
                      <div className="flex items-center justify-between w-full self-center">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-6 mr-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Book size={14} />
                            <span>{item.project_count || 0} Projekte</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSeries(item)}
                          >
                            <Edit size={14} className="mr-1 sm:mr-1" />
                            <span className="hidden sm:inline">Bearbeiten</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="pt-0 bg-transparent">
                      <div className="space-y-6">
                        {/* Zugeordnete Projekte Section */}
                        <div className="space-y-4">
                          <div className="relative rounded-lg border p-4">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                                <Book size={16} />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">
                                  Zugeordnete Projekte
                                </p>
                              </div>
                            </div>
                            <div className="ml-20">
                              {loadingProjects[item.id] ? (
                                <div className="py-4 text-sm text-muted-foreground text-center">
                                  Projekte werden geladen...
                                </div>
                              ) : seriesProjects[item.id]?.length > 0 ? (
                                <div className="space-y-3">
                                  {seriesProjects[item.id].map((project) => (
                                    <div
                                      key={project.id}
                                      className="flex items-center justify-between p-3 bg-slate-50 rounded border"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded bg-white">
                                          <Book size={14} />
                                        </div>
                                        <div>
                                          <Link
                                            to={`/project/${project.id}`}
                                            className="font-medium text-black underline decoration-2 decoration-primary-green hover:decoration-4 transition-all"
                                          >
                                            {project.title}
                                          </Link>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleRemoveProjectFromSeries(
                                            item.id,
                                            project.id,
                                          );
                                        }}
                                      >
                                        <Trash2
                                          size={14}
                                          className="text-muted-foreground hover:text-destructive"
                                        />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-muted-foreground">
                                    Keine Projekte in dieser Buchreihe
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="mt-6 pt-4 border-t flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(item.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Buchreihe löschen
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-muted-foreground mb-4">
            Keine Buchreihen gefunden
          </div>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            Erstelle deine erste Buchreihe
          </Button>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Buchreihe löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diese Buchreihe löschen möchten? Diese
              Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSeries}
              className="bg-red-600 hover:bg-red-700"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return content;
};

export default SeriesPage;
