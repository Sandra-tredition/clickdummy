import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Receipt, Euro } from "lucide-react";

interface Document {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
}

interface DocumentsManagementProps {
  documents?: Document[];
}

const DocumentsManagement: React.FC<DocumentsManagementProps> = ({
  documents = [],
}) => {
  const [documentFilter, setDocumentFilter] = useState("all");

  // Check if current user is the clean user (no mock data)
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isCleanUser = currentUser?.email === "clean@example.com";

  const mockDocuments: Document[] = isCleanUser
    ? []
    : [
        {
          id: "1",
          type: "agb",
          title: "Allgemeine Geschäftsbedingungen",
          description: "Gültig ab: 01.01.2023",
          date: "2023-01-01",
        },
        {
          id: "2",
          type: "privacy",
          title: "Datenschutzerklärung",
          description: "Gültig ab: 01.01.2023",
          date: "2023-01-01",
        },
        {
          id: "3",
          type: "commission",
          title: "Provisionsabrechnung 2023",
          description: "Für Ihre Steuererklärung",
          date: "2023-12-31",
        },
        {
          id: "4",
          type: "commission",
          title: "Provisionsabrechnung 2022",
          description: "Für Ihre Steuererklärung",
          date: "2022-12-31",
        },
        {
          id: "5",
          type: "invoice",
          title: "Rechnung R-2023-001",
          description: "Bestellung vom 15.03.2023",
          date: "2023-03-15",
        },
        {
          id: "6",
          type: "invoice",
          title: "Rechnung R-2023-002",
          description: "Bestellung vom 22.05.2023",
          date: "2023-05-22",
        },
        {
          id: "7",
          type: "invoice",
          title: "Rechnung R-2023-003",
          description: "Bestellung vom 08.09.2023",
          date: "2023-09-08",
        },
        {
          id: "8",
          type: "commission-credit",
          title: "Provisionsgutschrift PG-2023-11",
          description: "November 2023 - Verkaufserlöse",
          date: "2023-11-30",
        },
        {
          id: "9",
          type: "commission-credit",
          title: "Provisionsgutschrift PG-2023-10",
          description: "Oktober 2023 - Verkaufserlöse",
          date: "2023-10-31",
        },
        {
          id: "10",
          type: "commission-credit",
          title: "Provisionsgutschrift PG-2023-09",
          description: "September 2023 - Verkaufserlöse",
          date: "2023-09-30",
        },
      ];

  const allDocuments = documents.length > 0 ? documents : mockDocuments;

  const filteredDocuments = allDocuments.filter((doc) => {
    if (documentFilter === "all") return true;
    if (documentFilter === "commission") {
      return (
        doc.type === "commission" ||
        doc.type === "agb" ||
        doc.type === "privacy"
      );
    }
    return doc.type === documentFilter;
  });

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "invoice":
        return Receipt;
      case "commission-credit":
        return Euro;
      case "commission":
      case "agb":
      case "privacy":
        return FileText;
      default:
        return FileText;
    }
  };

  return (
    <div className="bg-white">
      <Card>
        <CardHeader>
          <CardTitle>Dokumente</CardTitle>
          <CardDescription>
            Hier findest du alle durch die App erstellten Dokumente zu deinem
            Konto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Document Filter Tabs */}
          {allDocuments.length > 0 && (
            <div className="w-full">
              <Tabs value={documentFilter} onValueChange={setDocumentFilter}>
                <TabsList className="h-8 p-1 bg-muted rounded-lg inline-flex w-auto gap-1">
                  <TabsTrigger
                    value="all"
                    className="rounded-md px-3 py-1 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-0 h-6"
                  >
                    Alle
                  </TabsTrigger>
                  <TabsTrigger
                    value="invoice"
                    className="rounded-md px-3 py-1 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-0 h-6"
                  >
                    Rechnungen
                  </TabsTrigger>
                  <TabsTrigger
                    value="commission-credit"
                    className="rounded-md px-3 py-1 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-0 h-6"
                  >
                    <span className="hidden sm:inline">
                      Provisionsgutschriften
                    </span>
                    <span className="sm:hidden">Provisionen</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="commission"
                    className="rounded-md px-3 py-1 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-0 h-6"
                  >
                    Sonstige
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Document List */}
          <div className="space-y-3">
            {allDocuments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Keine Dokumente vorhanden.</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Keine Dokumente in dieser Kategorie gefunden.</p>
              </div>
            ) : (
              filteredDocuments.map((document) => {
                const IconComponent = getDocumentIcon(document.type);
                return (
                  <div key={document.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-muted p-2">
                          <IconComponent
                            className={`h-4 w-4 ${
                              document.type === "invoice"
                                ? "text-blue-600"
                                : document.type === "commission-credit"
                                  ? "text-green-600"
                                  : document.type === "commission" ||
                                      document.type === "agb" ||
                                      document.type === "privacy"
                                    ? "text-purple-600"
                                    : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{document.title}</p>
                          <p className="text-sm text-muted-foreground truncate sm:whitespace-normal">
                            {document.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">
                            Herunterladen
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsManagement;
