import React from "react";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

interface TourStep {
  title: string;
  content: string;
  target: string | null;
}

interface ProjectTourProps {
  showTour: boolean;
  tourStep: number;
  tourSteps: TourStep[];
  onNextStep: () => void;
  onCloseTour: () => void;
  getTargetElementPosition: (targetId: string) => any;
}

const ProjectTour: React.FC<ProjectTourProps> = ({
  showTour,
  tourStep,
  tourSteps,
  onNextStep,
  onCloseTour,
  getTargetElementPosition,
}) => {
  if (!showTour) return null;

  const currentStep = tourSteps[tourStep];

  return (
    <>
      {/* Dimming overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-60 z-40" />

      {/* Spotlight effect for target element */}
      {currentStep.target && (
        <div
          className="fixed z-45 pointer-events-none"
          style={{
            boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6)`,
            ...getTargetElementPosition(currentStep.target),
          }}
        />
      )}

      {/* Tour dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative pointer-events-auto shadow-2xl">
          <button
            onClick={onCloseTour}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
          >
            <XIcon className="h-4 w-4" />
          </button>
          <h3 className="text-lg font-semibold mb-3">{currentStep.title}</h3>
          <p className="text-gray-600 mb-4">{currentStep.content}</p>
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === tourStep ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCloseTour}>
                Überspringen
              </Button>
              <Button onClick={onNextStep}>
                {tourStep < tourSteps.length - 1 ? "Weiter" : "Fertig"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectTour;
