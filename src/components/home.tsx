import React, { useState, useEffect } from "react";
import { PlusCircle, AlertCircleIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectGrid from "@/components/Dashboard/ProjectGrid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";

import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";

const Home = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workingTitle, setWorkingTitle] = useState("");

  // State for projects - will be loaded from database
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "Deutsch",
  ]);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Check if user is new (no projects) to show tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour && projects.length === 0) {
      setShowTour(true);
    }
  }, [projects]);

  // Check if we should start tour on new project page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const startTour = urlParams.get("startTour");
    const hasSeenTour = localStorage.getItem("hasSeenTour");

    if (startTour === "true" && !hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  // Load projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Check if current user is the clean user (no mock data)
        const currentUser = JSON.parse(
          localStorage.getItem("currentUser") || "null",
        );
        const isCleanUser = currentUser?.email === "clean@example.com";
        const isDemoUser = currentUser?.email === "demo@example.com";

        if (isCleanUser) {
          console.log("Clean user detected - no mock data will be shown");
          setProjects([]);
          return;
        }

        // For demo user, load demo projects from mock data
        if (isDemoUser) {
          console.log("Demo user detected - loading demo projects");

          // Import and use mock projects directly
          const { getProjectsByUser } = await import("@/lib/mockData/projects");
          const demoProjects = getProjectsByUser("demo@example.com");

          if (demoProjects.length > 0) {
            // Import editions data to get edition counts
            const { mockProjects } = await import("@/lib/mockData/projects");

            const uiProjects = demoProjects.map((project: any) => {
              // Get edition count from mock data based on project ID
              let editionCount = 0;
              if (project.id === "1") editionCount = 2; // Digitales Publizieren has 2 editions
              if (project.id === "2") editionCount = 0; // Kreatives Schreiben has 0 editions
              if (project.id === "3") editionCount = 2; // Marketing has 2 editions

              return {
                id: project.id,
                title: project.title,
                coverImage: project.cover_image,
                status: project.status,
                languages: project.languages,
                editionCount: editionCount,
                lastEdited: project.updated_at
                  ? new Date(project.updated_at).toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0],
              };
            });
            setProjects(uiProjects);
            return;
          }
        }

        console.log("Fetching projects from Supabase...");
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching projects:", error);
          // If there's an error, try to create a default project
          createDefaultProject();
          return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
          console.log(
            "Projects fetched successfully:",
            data.length,
            "projects",
          );
          // Transform the data to match the UI format
          const uiProjects = data.map((project) => ({
            id: project.id,
            title: project.title,
            coverImage:
              project.cover_image ||
              "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80",
            status: "draft",
            languages: project.languages || ["Deutsch"],
            editionCount: 0, // Default to 0 for database projects
            lastEdited: project.updated_at
              ? new Date(project.updated_at).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
          }));
          setProjects(Array.isArray(uiProjects) ? uiProjects : []);
        } else {
          console.log("No projects found, creating a default project");
          // If no projects are found, create a default one
          createDefaultProject();
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        // If there's an exception, create a default project for demo purposes
        createDefaultProject();
        // Ensure projects is always an array
        setProjects([]);
      }
    };

    // Function to create a default project for demo purposes
    const createDefaultProject = () => {
      const demoProject = {
        id: "demo-project-1",
        title: "Beispielprojekt",
        coverImage:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
        status: "draft",
        languages: ["Deutsch"],
        editionCount: 0,
        lastEdited: new Date().toISOString().split("T")[0],
      };
      setProjects([demoProject]);
    };

    fetchProjects();
  }, []);

  // Function to create a new project (frontend only)
  const createNewProject = async () => {
    try {
      // Generate a unique ID for the frontend-only project
      const uniqueId = `frontend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create a new project with the working title from the dialog
      const newProject = {
        id: uniqueId,
        title: workingTitle || "Neues Buchprojekt", // Use the entered title or default
        coverImage:
          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80",
        status: "draft" as const,
        languages:
          selectedLanguages.length > 0 ? selectedLanguages : ["Deutsch"],
        editionCount: 0,
        lastEdited: new Date().toISOString().split("T")[0],
      };

      console.log("Erstelle neues Frontend-Projekt:", newProject);

      // Store the project data in localStorage for the project detail page to access
      const frontendProjects = JSON.parse(
        localStorage.getItem("frontendProjects") || "{}",
      );
      frontendProjects[uniqueId] = {
        id: uniqueId,
        title: workingTitle || "Neues Buchprojekt",
        description: "Ein neues Buchprojekt, das gerade erstellt wurde.",
        cover_image:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
        languages:
          selectedLanguages.length > 0 ? selectedLanguages : ["Deutsch"],
        genres: [],
        target_audience: "",
        target_audience_groups: [],
        slogan: "",
        selling_points: "",
        keywords: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(
        "frontendProjects",
        JSON.stringify(frontendProjects),
      );

      console.log(
        "Stored project data in localStorage:",
        frontendProjects[uniqueId],
      );

      // Ensure projects is an array before spreading
      const currentProjects = Array.isArray(projects) ? projects : [];
      setProjects([newProject, ...currentProjects]);

      // Close the dialog
      setIsDialogOpen(false);

      // Reset the form
      setWorkingTitle("");
      setSelectedLanguages(["Deutsch"]);

      // Navigate to the project detail page with tour parameter
      const hasSeenTour = localStorage.getItem("hasSeenTour");
      if (!hasSeenTour) {
        navigate(`/project/${newProject.id}?startTour=true`);
      } else {
        navigate(`/project/${newProject.id}`);
      }
    } catch (error) {
      console.error("Error creating new project:", error);
    }
  };

  // Function to open the dialog
  const openNewProjectDialog = () => {
    setIsDialogOpen(true);
  };

  // Tour functions
  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      closeTour();
    }
  };

  const closeTour = () => {
    setShowTour(false);
    localStorage.setItem("hasSeenTour", "true");
  };

  const tourSteps = [
    {
      title: "Willkommen bei Ihrer Buchverwaltung!",
      content:
        "Hier können Sie Ihre Buchprojekte verwalten und neue Projekte erstellen.",
      target: null,
    },
    {
      title: "Neues Projekt erstellen",
      content:
        "Klicken Sie hier, um ein neues Buchprojekt anzulegen. Geben Sie einen Arbeitstitel ein und wählen Sie die Sprache aus.",
      target: "new-project-button",
    },
    {
      title: "Projektübersicht",
      content:
        "Hier sehen Sie alle Ihre Buchprojekte. Klicken Sie auf ein Projekt, um es zu bearbeiten.",
      target: "project-grid",
    },
  ];

  const currentStep = tourSteps[tourStep];

  return (
    <div className="max-w-7xl space-y-6 bg-white relative">
      {/* Tour Overlay */}
      {showTour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative">
            <button
              onClick={closeTour}
              className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-semibold mb-3">{currentStep.title}</h3>
            <p className="text-gray-600 mb-4">{currentStep.content}</p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === tourStep ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={closeTour}>
                  Überspringen
                </Button>
                <Button onClick={nextTourStep}>
                  {tourStep < tourSteps.length - 1 ? "Weiter" : "Fertig"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buchprojekte</h1>
          </div>
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button id="new-project-button">
                  <PlusCircle size={18} className="mr-2" />
                  Neues Buchprojekt anlegen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neues Buchprojekt anlegen</DialogTitle>
                  <DialogDescription>
                    Geben Sie einen Arbeitstitel für Ihr neues Buchprojekt ein.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="workingTitle" className="text-right">
                      Arbeitstitel
                    </Label>
                    <Input
                      id="workingTitle"
                      value={workingTitle}
                      onChange={(e) => setWorkingTitle(e.target.value)}
                      className="col-span-3"
                      placeholder="Neues Buchprojekt"
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Label htmlFor="languages" className="text-right">
                        Sprache(n)
                      </Label>
                      <div className="relative group">
                        <AlertCircleIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                        <div className="invisible group-hover:visible absolute z-50 p-2 bg-black text-white text-xs rounded w-64 -top-2 left-6">
                          Wähle die Sprache aus, in der dein Buch geschrieben
                          ist. Mehrfachnennungen sind möglich, wenn es sich bei
                          deinem Buch um einen mehrsprachigen Inhalt handelt.
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <MultiSelect
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
                          Array.isArray(selectedLanguages)
                            ? selectedLanguages
                            : []
                        }
                        onChange={(values) => {
                          setSelectedLanguages(
                            Array.isArray(values) ? values : [],
                          );
                        }}
                        placeholder="Sprachen auswählen"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={createNewProject}>Projekt erstellen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Project Grid Component */}
        <div id="project-grid">
          <ProjectGrid
            projects={projects}
            onCreateProject={openNewProjectDialog}
          />
        </div>
      </Card>
    </div>
  );
};

export default Home;
