import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function TestDataManager() {
  const [isClearing, setIsClearing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    error?: any;
  } | null>(null);

  const clearMockData = async () => {
    setIsClearing(true);
    setResult(null);

    try {
      // Mock clearing data - simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResult = {
        success: true,
        message: "Mock-Daten wurden erfolgreich gelöscht (simuliert).",
      };

      setResult(mockResult);

      toast({
        title: "Erfolg",
        description: "Mock-Daten wurden erfolgreich gelöscht (simuliert).",
      });
    } catch (error) {
      console.error("Error clearing mock data:", error);
      setResult({
        success: false,
        message: "Beim Löschen der Mock-Daten ist ein Fehler aufgetreten.",
        error: String(error),
      });
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Beim Löschen der Mock-Daten ist ein Fehler aufgetreten.",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const createTestData = async () => {
    setIsCreating(true);
    setResult(null);

    try {
      // Mock creating test data - simulate success
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockResult = {
        success: true,
        message: "Test-Daten wurden erfolgreich erstellt (simuliert).",
      };

      setResult(mockResult);

      toast({
        title: "Erfolg",
        description: "Test-Daten wurden erfolgreich erstellt (simuliert).",
      });
    } catch (error) {
      console.error("Error creating test data:", error);
      setResult({
        success: false,
        message: "Beim Erstellen der Test-Daten ist ein Fehler aufgetreten.",
        error: String(error),
      });
      toast({
        variant: "destructive",
        title: "Fehler",
        description:
          "Beim Erstellen der Test-Daten ist ein Fehler aufgetreten.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Test-Daten Verwaltung (Mock-Modus)</CardTitle>
        <CardDescription>
          Diese Funktionen sind jetzt im Mock-Modus und simulieren nur die
          Aktionen ohne echte Datenbankverbindung.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Mock-Daten löschen</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Simuliert das Löschen aller Test- und Mock-Daten. Da wir im
              Mock-Modus sind, werden keine echten Daten gelöscht.
            </p>
            <Button
              onClick={clearMockData}
              disabled={isClearing || isCreating}
              variant="destructive"
            >
              {isClearing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simuliere Löschung...
                </>
              ) : (
                "Mock-Daten löschen (simuliert)"
              )}
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Test-Daten erstellen</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Simuliert das Erstellen eines vollständigen Satzes von Test-Daten.
              Da wir im Mock-Modus sind, werden keine echten Daten erstellt.
            </p>
            <Button
              onClick={createTestData}
              disabled={isClearing || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simuliere Erstellung...
                </>
              ) : (
                "Test-Daten erstellen (simuliert)"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      {result && (
        <CardFooter className="flex flex-col items-start">
          <div
            className={`flex items-center ${
              result.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {result.success ? (
              <CheckCircle className="mr-2 h-5 w-5" />
            ) : (
              <AlertCircle className="mr-2 h-5 w-5" />
            )}
            <span className="font-medium">
              {result.success ? "Erfolg" : "Fehler"}
            </span>
          </div>
          <p className="text-sm mt-1">{result.message}</p>
          {result.error && (
            <pre className="text-xs mt-2 p-2 bg-gray-100 rounded w-full overflow-auto">
              {typeof result.error === "string"
                ? result.error
                : JSON.stringify(result.error, null, 2)}
            </pre>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
