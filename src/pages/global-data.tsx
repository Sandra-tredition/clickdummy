import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Authors from "./authors";
import Series from "./series";
import { useLocation, useNavigate } from "react-router-dom";

const GlobalDataPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Get tab from URL hash or default to "authors"
    return location.hash === "#series" ? "series" : "authors";
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`#${value}`, { replace: true });
  };

  return (
    <Layout title="Globale Daten">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Globale Daten</h1>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="authors">Urheber</TabsTrigger>
            <TabsTrigger value="series">Buchreihen</TabsTrigger>
          </TabsList>

          <TabsContent value="authors" className="space-y-4">
            <Authors isEmbedded={true} />
          </TabsContent>

          <TabsContent value="series" className="space-y-4">
            <Series isEmbedded={true} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default GlobalDataPage;
