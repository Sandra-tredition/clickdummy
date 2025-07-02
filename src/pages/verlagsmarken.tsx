import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusCircle, Edit, Trash2, Book } from "lucide-react";
import { Link } from "react-router-dom";

interface Verlagsmarke {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  contact_email?: string;
  project_count?: number;
}

interface Project {
  id: string;
  title: string;
  status: string;
}

interface VerlagsmarkenProps {
  isEmbedded?: boolean;
}

const Verlagsmarken = ({ isEmbedded = false }: VerlagsmarkenProps = {}) => {
  // Check if current user is the clean user (no mock data)
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isCleanUser = currentUser?.email === "clean@example.com";

  const [verlagsmarken, setVerlagsmarken] = useState<Verlagsmarke[]>(
    isCleanUser
      ? []
      : [
          {
            id: "1",
            name: "Beispiel Verlag",
            description:
              "Ein Beispielverlag für die Demonstration der Plattform.",
            website: "https://beispielverlag.de",
            contact_email: "kontakt@beispielverlag.de",
            project_count: 2,
          },
          {
            id: "2",
            name: "Literatur Verlag",
            description:
              "Spezialisiert auf literarische Werke und Belletristik.",
            website: "https://literaturverlag.de",
            contact_email: "info@literaturverlag.de",
            project_count: 1,
          },
        ],
  );

  // Mock data for projects assigned to Verlagsmarken
  const [verlagsmarkenProjects] = useState<Record<string, Project[]>>(
    isCleanUser
      ? {}
      : {
          "1": [
            { id: "1", title: "Beispielprojekt", status: "Draft" },
            { id: "2", title: "Mein Roman", status: "Published" },
          ],
          "2": [{ id: "3", title: "Literarisches Werk", status: "In Review" }],
        },
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMarke, setEditingMarke] = useState<Verlagsmarke | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    contact_email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMarke) {
      // Update existing
      setVerlagsmarken((prev) =>
        prev.map((marke) =>
          marke.id === editingMarke.id ? { ...marke, ...formData } : marke,
        ),
      );
    } else {
      // Create new
      const newMarke: Verlagsmarke = {
        id: Date.now().toString(),
        ...formData,
      };
      setVerlagsmarken((prev) => [...prev, newMarke]);
    }

    setIsDialogOpen(false);
    setEditingMarke(null);
    setFormData({ name: "", description: "", website: "", contact_email: "" });
  };

  const handleEdit = (marke: Verlagsmarke) => {
    setEditingMarke(marke);
    setFormData({
      name: marke.name,
      description: marke.description,
      website: marke.website || "",
      contact_email: marke.contact_email || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setVerlagsmarken((prev) => prev.filter((marke) => marke.id !== id));
  };

  const openNewDialog = () => {
    setEditingMarke(null);
    setFormData({ name: "", description: "", website: "", contact_email: "" });
    setIsDialogOpen(true);
  };

  const content = (
    <div className="max-w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Verlagsmarken</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} className="flex items-center gap-2">
              <PlusCircle size={16} />
              Neue Verlagsmarke
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingMarke ? "Verlagsmarke bearbeiten" : "Neue Verlagsmarke"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Beschreibung *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Kontakt E-Mail</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact_email: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Abbrechen
                </Button>
                <Button type="submit">
                  {editingMarke ? "Aktualisieren" : "Erstellen"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {verlagsmarken.map((marke) => (
          <Card key={marke.id} className="w-full border-2 shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={marke.id} className="border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 min-h-[60px]">
                    <AccordionTrigger className="hover:no-underline flex-shrink-0 self-center"></AccordionTrigger>
                    <div className="flex items-center justify-between w-full self-center">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{marke.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mr-4">
                        <div className="flex items-center gap-1">
                          <Book size={14} />
                          <span>{marke.project_count || 0} Projekte</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <AccordionContent>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {/* Grunddaten Section */}
                      <div className="space-y-4">
                        <div className="relative flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-16 items-center justify-center rounded bg-slate-100">
                              <Book size={16} />
                            </div>
                            <div>
                              <p className="font-medium">{marke.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {marke.description}
                              </p>
                              {marke.website && (
                                <a
                                  href={marke.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-black underline decoration-2 decoration-primary-green hover:decoration-4 transition-all"
                                >
                                  {marke.website}
                                </a>
                              )}
                              {marke.contact_email && (
                                <p className="text-sm text-muted-foreground">
                                  {marke.contact_email}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(marke)}
                            >
                              <Edit size={14} className="mr-1 sm:mr-1" />
                              <span className="hidden sm:inline">
                                Bearbeiten
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>

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
                            {verlagsmarkenProjects[marke.id]?.length > 0 ? (
                              <div className="space-y-3">
                                {verlagsmarkenProjects[marke.id].map(
                                  (project) => (
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
                                    </div>
                                  ),
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                  Keine Projekte dieser Verlagsmarke zugeordnet
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
                          onClick={() => handleDelete(marke.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Verlagsmarke löschen
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

      {verlagsmarken.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-muted-foreground mb-4">
            Noch keine Verlagsmarken vorhanden.
          </div>
          <Button variant="outline" onClick={openNewDialog}>
            Erstelle deine erste Verlagsmarke
          </Button>
        </div>
      )}
    </div>
  );

  return content;
};

export default Verlagsmarken;
