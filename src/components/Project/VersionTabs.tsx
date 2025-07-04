import React from "react";
import { Button } from "@/components/ui/button";
import { GitCompareIcon as CompareIcon } from "lucide-react";

interface VersionTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCompareMode: boolean;
  setIsCompareMode: (mode: boolean) => void;
  publishedProject: any;
}

const VersionTabs: React.FC<VersionTabsProps> = ({
  activeTab,
  setActiveTab,
  isCompareMode,
  setIsCompareMode,
  publishedProject,
}) => {
  return (
    <div className="bg-gray-100 border-gray-200 shadow-sm mb-6 py-3">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex-1 max-w-md">
            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-1">
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setActiveTab("editing")}
                  className={`px-4 py-2 text-center rounded-md transition-colors ${
                    activeTab === "editing"
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  Version in Bearbeitung
                </button>
                <button
                  onClick={() => setActiveTab("published")}
                  className={`px-4 py-2 text-center rounded-md transition-colors ${
                    activeTab === "published"
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  Veröffentlichte Version
                </button>
              </div>
            </div>
          </div>

          <Button
            variant={isCompareMode ? "secondary" : "outline"}
            className="ml-4 shadow-sm"
            onClick={() => setIsCompareMode(!isCompareMode)}
            disabled={!publishedProject}
          >
            <CompareIcon className="h-4 w-4 mr-2" />
            {isCompareMode ? "Vergleich beenden" : "Änderungen anzeigen"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VersionTabs;
