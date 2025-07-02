import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import { ArrowLeftIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import EditionHeader from "@/components/Edition/EditionHeader";
import EditionTabs from "@/components/Edition/EditionTabs";
import {
  validateCustomFormat,
  validatePdfFormat,
} from "@/lib/utils/fileValidation";
import {
  calculateMinimumPrice,
  calculateCommission,
} from "@/lib/utils/priceCalculation";
import { updateEdition } from "@/lib/api/editions";

// Define possible edition statuses
export type EditionStatus =
  | "Draft"
  | "In Review"
  | "Ready"
  | "Published"
  | "Needs Revision";

const EditionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("print-properties");
  const [contentUploaded, setContentUploaded] = useState(false);
  const [coverUploaded, setCoverUploaded] = useState(false);
  const [enableSampleReading, setEnableSampleReading] = useState(true);
  const [contentFile, setContentFile] = useState("");
  const [coverFile, setCoverFile] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("A5");
  const [colorPages, setColorPages] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [formatError, setFormatError] = useState("");
  const [edition, setEdition] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Individuelles Format
  const [customWidth, setCustomWidth] = useState("15.0");
  const [customHeight, setCustomHeight] = useState("21.0");
  const [customFormatError, setCustomFormatError] = useState("");

  // Druckeinstellungen
  const [selectedPaperType, setSelectedPaperType] = useState("textdruck-weiss");
  const [selectedCoverFinish, setSelectedCoverFinish] = useState("matt");
  const [selectedSpineType, setSelectedSpineType] = useState("gerade");

  // Preisgestaltung
  const [basePrice, setBasePrice] = useState(0);
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(19.99);
  const [authorCommission, setAuthorCommission] = useState(30);

  // Status tracking
  const [editionStatus, setEditionStatus] = useState<EditionStatus>("Draft");
  const [statusHistory, setStatusHistory] = useState<
    Array<{ status: EditionStatus; timestamp: string }>
  >([]);

  // Preis-Änderungsverfolgung für Feedback
  const [priceImpact, setPriceImpact] = useState<{
    paperType: number;
    coverFinish: number;
    spineType: number;
    colorPages: number;
    format: number;
  }>({ paperType: 0, coverFinish: 0, spineType: 0, colorPages: 0, format: 0 });

  // Generiere Beispielseiten für die Farbauswahl
  const [pages, setPages] = useState<{ page: number; title: string }[]>([]);

  // Lade die Edition-Daten mit Mock-Daten statt Supabase
  useEffect(() => {
    const loadMockEdition = async () => {
      if (!id) {
        console.error("No edition ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log("Loading mock edition data for ID:", id);
        // Simuliere Netzwerkverzögerung
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock-Daten für die Edition
        const mockData = {
          id: id,
          title: "Mein Buch - Standardausgabe",
          status: "Ready" as EditionStatus,
          produktform: "Softcover",
          ausgabenart: "Standard",
          paper_type: "textdruck-weiss",
          cover_finish: "matt",
          price: 19.99,
          content_file: "inhalt.pdf",
          cover_file: "cover.jpg",
          pages: 250,
          created_at: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          status_history: [
            {
              status: "Draft" as EditionStatus,
              timestamp: new Date(
                Date.now() - 7 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            },
            {
              status: "Ready" as EditionStatus,
              timestamp: new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            },
          ],
        };

        console.log("Mock edition data loaded:", mockData);
        setEdition(mockData);

        // Setze die Formularfelder basierend auf den Mock-Daten
        setSelectedFormat(mockData.produktform);
        setSelectedPaperType(mockData.paper_type);
        setSelectedCoverFinish(mockData.cover_finish);
        setSellingPrice(Number(mockData.price));
        setContentUploaded(true);
        setContentFile(mockData.content_file);
        setCoverUploaded(true);
        setCoverFile(mockData.cover_file);
        setTotalPages(Number(mockData.pages));
        setEditionStatus(mockData.status);
        setStatusHistory(mockData.status_history);
        setColorPages([1, 5, 10, 15]); // Beispiel für farbige Seiten
      } catch (error) {
        console.error("Error loading mock edition:", error);
        toast({
          title: "Fehler",
          description: "Die Ausgabe konnte nicht geladen werden.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMockEdition();
  }, [id]);

  useEffect(() => {
    if (contentUploaded && totalPages > 0) {
      const newPages = [];
      for (let i = 1; i <= totalPages; i++) {
        newPages.push({
          page: i,
          title: `Seite ${i}`,
        });
      }
      setPages(newPages);
    } else {
      setPages([]);
    }
  }, [contentUploaded, totalPages]);

  // Update status based on completeness
  useEffect(() => {
    // Only auto-update status if it's still in Draft
    if (editionStatus === "Draft" && contentUploaded && coverUploaded) {
      updateEditionStatus("Ready");
    }
  }, [contentUploaded, coverUploaded, editionStatus]);

  const toggleColorPage = (pageNumber: number) => {
    setColorPages((prev) => {
      if (prev.includes(pageNumber)) {
        return prev.filter((p) => p !== pageNumber);
      } else {
        return [...prev, pageNumber];
      }
    });
  };

  // Update edition status and history
  const updateEditionStatus = (newStatus: EditionStatus) => {
    // Don't update if status hasn't changed
    if (newStatus === editionStatus) return;

    // Add to history
    const newHistoryEntry = {
      status: newStatus,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...statusHistory, newHistoryEntry];
    setStatusHistory(updatedHistory);
    setEditionStatus(newStatus);

    // Show notification
    toast({
      title: "Status aktualisiert",
      description: `Der Status wurde auf "${getStatusDisplayName(newStatus)}" geändert.`,
    });
  };

  // Helper function to get display name for status
  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "Draft":
        return "Entwurf";
      case "In Review":
        return "In Prüfung";
      case "Ready":
        return "Bereit";
      case "Published":
        return "Veröffentlicht";
      case "Needs Revision":
        return "Überarbeitung nötig";
      default:
        return status || "Entwurf";
    }
  };

  // Validiert das individuelle Format
  const validateCustomFormatHandler = () => {
    return validateCustomFormat(
      customWidth,
      customHeight,
      setCustomFormatError,
    );
  };

  // Berechnet den Mindestpreis basierend auf den Druckeinstellungen und Seitenzahlen
  const calculateMinimumPriceHandler = () => {
    if (!contentUploaded || totalPages === 0) return 0;

    const minPrice = calculateMinimumPrice(
      totalPages,
      selectedPaperType,
      selectedCoverFinish,
      selectedSpineType,
      selectedFormat,
      setPriceImpact,
    );

    setMinimumPrice(minPrice);

    // Wenn der aktuelle Verkaufspreis unter dem Mindestpreis liegt, passen wir ihn an
    if (sellingPrice < minPrice) {
      setSellingPrice(minPrice);
    }

    return minPrice;
  };

  // Berechnet die Provision basierend auf dem Verkaufspreis und den Produktionskosten
  const calculateCommissionHandler = () => {
    return calculateCommission(sellingPrice, minimumPrice);
  };

  // Aktualisiert die Berechnungen, wenn sich relevante Parameter ändern
  useEffect(() => {
    if (contentUploaded) {
      calculateMinimumPriceHandler();
      const newCommission = calculateCommissionHandler();
      setAuthorCommission(newCommission);
    }
  }, [
    contentUploaded,
    totalPages,
    colorPages,
    selectedPaperType,
    selectedCoverFinish,
    selectedSpineType,
    sellingPrice,
  ]);

  const handleContentUpload = () => {
    // Create file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf"; // Nur PDF-Dateien erlauben
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Überprüfe, ob es sich um eine PDF-Datei handelt
        if (!file.name.toLowerCase().endsWith(".pdf")) {
          toast({
            title: "Ungültiges Dateiformat",
            description: "Bitte laden Sie nur PDF-Dateien hoch.",
            variant: "destructive",
          });
          return;
        }

        // Show loading toast
        toast({
          title: "Inhalt wird hochgeladen",
          description:
            "Bitte warten Sie, während der Inhalt hochgeladen und validiert wird...",
        });

        try {
          // Validiere das PDF-Format
          const validation = await validatePdfFormat(file);

          if (!validation.valid) {
            setFormatError(
              `Die PDF-Datei entspricht nicht dem ausgewählten Format.`,
            );
            toast({
              title: "Formatfehler",
              description: `Die PDF-Datei entspricht nicht dem ausgewählten Format.`,
              variant: "destructive",
            });
            return;
          }

          // Update state to mark content as complete
          setContentUploaded(true);
          setContentFile(file.name);
          setTotalPages(validation.pages);
          setFormatError("");
          setColorPages([]); // Zurücksetzen der farbigen Seiten

          // Show success toast
          toast({
            title: "Inhalt erfolgreich hochgeladen",
            description: `Die Datei "${file.name}" wurde erfolgreich hochgeladen und verarbeitet. ${validation.pages} Seiten erkannt.`,
            variant: "default",
          });

          // Update content upload date
          if (id) {
            await supabase
              .from("editions")
              .update({
                content_upload_date: new Date().toISOString(),
                content_complete: true,
              })
              .eq("id", id);
          }
        } catch (error) {
          console.error("Error uploading content:", error);
          // Show error toast
          toast({
            title: "Fehler beim Hochladen",
            description:
              "Es ist ein Fehler beim Hochladen des Inhalts aufgetreten. Bitte versuchen Sie es erneut.",
            variant: "destructive",
          });
        }
      }
    };
    fileInput.click();
  };

  const handleCoverUpload = () => {
    // Create file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Show loading toast
        toast({
          title: "Cover wird hochgeladen",
          description:
            "Bitte warten Sie, während das Cover hochgeladen wird...",
        });

        try {
          // Simulate file upload with a delay
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Update state to mark cover as complete
          setCoverUploaded(true);
          setCoverFile(file.name);

          // Show success toast
          toast({
            title: "Cover erfolgreich hochgeladen",
            description: `Das Cover "${file.name}" wurde erfolgreich hochgeladen und verarbeitet.`,
            variant: "default",
          });

          // Update cover upload date
          if (id) {
            await supabase
              .from("editions")
              .update({
                cover_upload_date: new Date().toISOString(),
                cover_complete: true,
              })
              .eq("id", id);
          }
        } catch (error) {
          console.error("Error uploading cover:", error);
          // Show error toast
          toast({
            title: "Fehler beim Hochladen",
            description:
              "Es ist ein Fehler beim Hochladen des Covers aufgetreten. Bitte versuchen Sie es erneut.",
            variant: "destructive",
          });
        }
      }
    };
    fileInput.click();
  };

  // Speichern der Änderungen (Mock-Version ohne Datenbankzugriff)
  const saveChanges = async () => {
    if (!id) return;

    const updatedEdition = {
      produktform: selectedFormat,
      paper_type: selectedPaperType,
      cover_finish: selectedCoverFinish,
      price: sellingPrice,
      content_file: contentFile || null,
      cover_file: coverFile || null,
      pages: totalPages || 0,
      status: editionStatus,
      status_history: statusHistory,
      content_complete: contentUploaded,
      cover_complete: coverUploaded,
      pricing_complete: sellingPrice > 0,
      is_complete: contentUploaded && coverUploaded && sellingPrice > 0,
      updated_at: new Date().toISOString(),
    };

    try {
      // Simuliere eine Verzögerung wie bei einem API-Aufruf
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Aktualisiere den lokalen Zustand mit den neuen Daten
      setEdition((prev) => ({ ...prev, ...updatedEdition }));

      toast({
        title: "Änderungen gespeichert",
        description: "Die Änderungen wurden erfolgreich gespeichert (Mock).",
      });
    } catch (error) {
      console.error("Error saving edition:", error);
      toast({
        title: "Fehler beim Speichern",
        description: "Die Änderungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout title="Ausgabe wird geladen...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Ausgabe wird geladen...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={edition?.title || "Neue Ausgabe"}>
      <div className="max-w-7xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Zurück zum Projekt
          </Button>
        </div>

        <EditionHeader edition={edition} saveChanges={saveChanges} />

        <EditionTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          contentUploaded={contentUploaded}
          coverUploaded={coverUploaded}
          edition={edition}
          selectedFormat={selectedFormat}
          selectedPaperType={selectedPaperType}
          selectedCoverFinish={selectedCoverFinish}
          selectedSpineType={selectedSpineType}
          totalPages={totalPages}
          colorPages={colorPages}
          contentFile={contentFile}
          coverFile={coverFile}
          customWidth={customWidth}
          customHeight={customHeight}
          customFormatError={customFormatError}
          setCustomWidth={setCustomWidth}
          setCustomHeight={setCustomHeight}
          validateCustomFormat={validateCustomFormatHandler}
          handleContentUpload={handleContentUpload}
          handleCoverUpload={handleCoverUpload}
          setContentUploaded={setContentUploaded}
          setContentFile={setContentFile}
          setTotalPages={setTotalPages}
          setColorPages={setColorPages}
          setCoverUploaded={setCoverUploaded}
          setCoverFile={setCoverFile}
          toggleColorPage={toggleColorPage}
          formatError={formatError}
          pages={pages}
          enableSampleReading={enableSampleReading}
          setEnableSampleReading={setEnableSampleReading}
          priceImpact={priceImpact}
          minimumPrice={minimumPrice}
          sellingPrice={sellingPrice}
          setSellingPrice={setSellingPrice}
          authorCommission={authorCommission}
          calculateCommission={calculateCommissionHandler}
        />
      </div>
    </Layout>
  );
};

export default EditionDetailPage;
