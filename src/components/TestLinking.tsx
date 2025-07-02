import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestLinking() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("create-single");

  const runSingleTest = async () => {
    setLoading(true);
    try {
      // Call our test endpoint
      const response = await fetch("/api/test-author-linking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error running test");
      }

      setResult(data);
      toast({
        title: "Test completed",
        description: data.message,
      });
    } catch (error: any) {
      console.error("Test error:", error);
      toast({
        title: "Test failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCompleteTestData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-test-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error creating test data");
      }

      setResult(data);
      toast({
        title: "Test data created",
        description: data.message,
      });
    } catch (error: any) {
      console.error("Error creating test data:", error);
      toast({
        title: "Failed to create test data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearAllMockData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/clear-mock-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error clearing mock data");
      }

      setResult(data);
      toast({
        title: "Mock data cleared",
        description: data.message,
      });
    } catch (error: any) {
      console.error("Error clearing mock data:", error);
      toast({
        title: "Failed to clear mock data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Test Author Linking</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="create-single">Create Single Test</TabsTrigger>
            <TabsTrigger value="create-complete">
              Create Complete Test Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create-single" className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={runSingleTest} disabled={loading}>
                {loading ? "Creating..." : "Create Single Test"}
              </Button>
              <Button
                onClick={clearAllMockData}
                disabled={loading}
                variant="outline"
              >
                Clear All Mock Data
              </Button>
            </div>

            {result && (
              <div className="mt-4 border rounded-md p-4 bg-muted/20">
                <h3 className="font-medium mb-2">Test Results:</h3>
                <pre className="text-xs overflow-auto p-2 bg-muted rounded-md max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </TabsContent>

          <TabsContent value="create-complete" className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={createCompleteTestData} disabled={loading}>
                {loading ? "Creating..." : "Create Complete Test Data"}
              </Button>
              <Button
                onClick={clearAllMockData}
                disabled={loading}
                variant="outline"
              >
                Clear All Mock Data
              </Button>
            </div>

            {result && (
              <div className="mt-4 border rounded-md p-4 bg-muted/20">
                <h3 className="font-medium mb-2">Test Results:</h3>
                <pre className="text-xs overflow-auto p-2 bg-muted rounded-md max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
