import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Trash2, RefreshCw } from "lucide-react";

const TestDataManager = () => {
  const breadcrumbs = [{ label: "Test Data Manager" }];

  const handleClearTestData = () => {
    // Clear localStorage test data
    localStorage.removeItem("frontendProjects");
    localStorage.removeItem("currentUser");
    console.log("Test data cleared");
    alert("Test data has been cleared");
  };

  const handleResetToDefaults = () => {
    // Reset to default test data
    const defaultProjects = {
      "frontend-1": {
        id: "frontend-1",
        title: "Test Project 1",
        description: "A test project for development",
        cover_image:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
        languages: ["Deutsch"],
        genres: ["fiction.literary"],
        target_audience: "Test audience",
        target_audience_groups: ["Erwachsene"],
        slogan: "Test slogan",
        selling_points: "Test selling points",
        keywords: "test, development",
      },
    };

    localStorage.setItem("frontendProjects", JSON.stringify(defaultProjects));
    console.log("Test data reset to defaults");
    alert("Test data has been reset to defaults");
  };

  return (
    <Layout title="Test Data Manager" breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Data Manager
          </h1>
          <p className="text-gray-600">
            Manage test data for development and testing purposes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Clear Test Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Remove all test data from localStorage including projects and
                user data.
              </p>
              <Button
                onClick={handleClearTestData}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Reset to Defaults
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Reset test data to default values for consistent testing.
              </p>
              <Button
                onClick={handleResetToDefaults}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Current Test Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Frontend Projects
                </h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-40">
                  {JSON.stringify(
                    JSON.parse(
                      localStorage.getItem("frontendProjects") || "{}",
                    ),
                    null,
                    2,
                  )}
                </pre>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Current User</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-40">
                  {JSON.stringify(
                    JSON.parse(localStorage.getItem("currentUser") || "null"),
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TestDataManager;
