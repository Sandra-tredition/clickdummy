import React from "react";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

interface ComparisonSidebarProps {
  isCompareMode: boolean;
  setIsCompareMode: (mode: boolean) => void;
  getProjectDifferences: () => any[];
}

const ComparisonSidebar: React.FC<ComparisonSidebarProps> = ({
  isCompareMode,
  setIsCompareMode,
  getProjectDifferences,
}) => {
  if (!isCompareMode) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg overflow-y-auto z-10 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Änderungen</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCompareMode(false)}
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>

      {getProjectDifferences().length === 0 ? (
        <p className="text-gray-500 italic">Keine Änderungen gefunden</p>
      ) : (
        <div className="space-y-4">
          {getProjectDifferences().map((diff, index) => (
            <div key={index} className="border-b pb-3">
              <h4 className="font-medium text-sm">{diff.field}</h4>
              <div className="mt-1 text-sm bg-red-50 p-2 rounded">
                <span className="line-through">{diff.oldValue}</span>
              </div>
              <div className="mt-1 text-sm bg-green-50 p-2 rounded">
                <span>{diff.newValue}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComparisonSidebar;
