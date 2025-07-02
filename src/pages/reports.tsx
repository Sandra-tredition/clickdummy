import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart, PieChart } from "lucide-react";

const Reports = () => {
  return (
    <Layout title="Berichte">
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Verkäufe
          </TabsTrigger>
          <TabsTrigger value="readers" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Leserschaft
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verkaufsübersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <BarChart3 size={64} className="text-muted-foreground mb-4" />
                <p className="text-base text-muted-foreground">
                  Verkaufsstatistiken werden in Kürze verfügbar sein.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="readers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leserdemografie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <PieChart size={64} className="text-muted-foreground mb-4" />
                <p className="text-base text-muted-foreground">
                  Leseranalysen werden in Kürze verfügbar sein.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Markttrends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <LineChart size={64} className="text-muted-foreground mb-4" />
                <p className="text-base text-muted-foreground">
                  Trendanalysen werden in Kürze verfügbar sein.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Reports;
