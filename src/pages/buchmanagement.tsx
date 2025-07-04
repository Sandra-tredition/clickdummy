import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Library, Building } from "lucide-react";
import Home from "@/components/home";
import Authors from "./authors";
import Series from "./series";
import Verlagsmarken from "./verlagsmarken";
import { useLocation, useNavigate } from "react-router-dom";

const Buchmanagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Get tab from URL hash or default to "projects"
    const hash = location.hash.replace("#", "").split("&")[0]; // Extract tab name before any parameters
    if (["projects", "authors", "series", "verlagsmarken"].includes(hash)) {
      return hash;
    }
    return "projects";
  });

  // Listen for hash changes and update active tab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").split("&")[0];
      if (["projects", "authors", "series", "verlagsmarken"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    // Also check on location change (for programmatic navigation)
    const hash = location.hash.replace("#", "").split("&")[0];
    if (["projects", "authors", "series", "verlagsmarken"].includes(hash)) {
      setActiveTab(hash);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [location.hash]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`#${value}`, { replace: true });
  };

  const breadcrumbs = [{ label: "Buchmanagement" }];

  return (
    <Layout title="Buchmanagement" breadcrumbs={breadcrumbs}>
      <div className="w-full space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="">
          <TabsList className="mb-6 grid grid-cols-4">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span className="hidden sm:inline">Buchprojekte</span>
            </TabsTrigger>
            <TabsTrigger value="authors" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden sm:inline">Urheber</span>
            </TabsTrigger>
            <TabsTrigger value="series" className="flex items-center gap-2">
              <Library size={16} />
              <span className="hidden sm:inline">Buchreihen</span>
            </TabsTrigger>
            <TabsTrigger
              value="verlagsmarken"
              className="flex items-center gap-2"
            >
              <Building size={16} />
              <span className="hidden sm:inline">Verlagsmarken</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4 pt-4">
            <Home />
          </TabsContent>

          <TabsContent value="authors" className="space-y-4 pt-4">
            <Authors />
          </TabsContent>

          <TabsContent value="series" className="space-y-4 pt-4">
            <Series />
          </TabsContent>

          <TabsContent value="verlagsmarken" className="space-y-4 pt-4">
            <Verlagsmarken />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Buchmanagement;
