import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  SearchIcon,
  PlusCircleIcon,
  InfoIcon,
  ArrowLeftIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

interface EntityCreationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: "series" | "publisher";
  existingEntities: any[];
  onComplete: (mode: "existing" | "new", data: any) => void;
  directCreateMode?: boolean;
  editingData?: { name: string; description: string } | null;
}

const EntityCreationModal: React.FC<EntityCreationModalProps> = ({
  isOpen,
  onOpenChange,
  entityType,
  existingEntities,
  onComplete,
  directCreateMode = false,
  editingData = null,
}) => {
  const [step, setStep] = useState<"selection" | "form">(
    directCreateMode ? "form" : "selection",
  );
  const [creationMode, setCreationMode] = useState<"existing" | "new" | null>(
    directCreateMode ? "new" : null,
  );
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
  }>({ name: "", description: "" });

  // Initialize form data when editing
  React.useEffect(() => {
    if (editingData && isOpen) {
      setFormData({
        name: editingData.name || "",
        description: editingData.description || "",
      });
    } else if (!editingData && isOpen) {
      setFormData({ name: "", description: "" });
    }
  }, [editingData, isOpen]);

  const entityLabels = {
    series: {
      singular: "Buchreihe",
      plural: "Buchreihen",
      managementPath: "/buchmanagement?tab=series",
      managementLabel: "Buchreihen-Übersicht",
    },
    publisher: {
      singular: "Verlagsmarke",
      plural: "Verlagsmarken",
      managementPath: "/buchmanagement?tab=verlagsmarken",
      managementLabel: "Verlagsmarken-Übersicht",
    },
  };

  const labels = entityLabels[entityType];

  const handleClose = () => {
    setStep(directCreateMode ? "form" : "selection");
    setCreationMode(directCreateMode ? "new" : null);
    setSelectedEntityId("");
    setFormData({ name: "", description: "" });
    onOpenChange(false);
  };

  const handleModeSelection = (mode: "existing" | "new") => {
    setCreationMode(mode);
    if (mode === "existing") {
      setStep("form");
    } else {
      setFormData({ name: "", description: "" });
      setStep("form");
    }
  };

  const handleComplete = () => {
    if (creationMode === "existing" && selectedEntityId) {
      const selectedEntity = existingEntities.find(
        (entity) => entity.id === selectedEntityId,
      );
      if (selectedEntity) {
        onComplete("existing", selectedEntity);
      }
    } else if (creationMode === "new" && formData.name.trim()) {
      onComplete("new", formData);
    }
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingData
              ? `${labels.singular} bearbeiten`
              : `${labels.singular} hinzufügen`}
          </DialogTitle>
          <DialogDescription>
            {step === "selection" &&
              `Wähle aus, ob du eine bestehende ${labels.singular} auswählen oder eine neue anlegen möchtest.`}
            {step === "form" &&
              (creationMode === "existing"
                ? `Wähle eine bestehende ${labels.singular} aus.`
                : editingData
                  ? `Bearbeite die ${labels.singular}.`
                  : `Lege eine neue ${labels.singular} an.`)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Selection Mode */}
          {step === "selection" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer group"
                  onClick={() => handleModeSelection("existing")}
                >
                  <div className="text-center">
                    <SearchIcon className="h-12 w-12 mx-auto mb-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Bestehende {labels.singular} auswählen
                    </h3>
                    <p className="text-sm text-gray-600">
                      Wähle eine bereits angelegte {labels.singular} aus der
                      Liste aus.
                    </p>
                  </div>
                </div>

                <div
                  className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer group"
                  onClick={() => handleModeSelection("new")}
                >
                  <div className="text-center">
                    <PlusCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Neue {labels.singular} anlegen
                    </h3>
                    <p className="text-sm text-gray-600">
                      Erstelle eine komplett neue {labels.singular}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Form */}
          {step === "form" && (
            <div className="space-y-4">
              {creationMode === "existing" ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">
                    Bestehende {labels.singular} auswählen
                  </h3>
                  <div className="space-y-3">
                    <Label htmlFor="entity-select">{labels.singular}</Label>
                    <Select
                      value={selectedEntityId}
                      onValueChange={setSelectedEntityId}
                    >
                      <SelectTrigger id="entity-select">
                        <SelectValue
                          placeholder={`${labels.singular} auswählen`}
                        />
                      </SelectTrigger>
                      <SelectContent
                        className="max-h-[200px] overflow-y-auto"
                        position="popper"
                        sideOffset={5}
                      >
                        {existingEntities.map((entity) => (
                          <SelectItem key={entity.id} value={entity.id}>
                            <span className="font-medium">{entity.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedEntityId && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                      <h5 className="font-medium text-sm text-gray-900 mb-2">
                        Ausgewählte {labels.singular}:
                      </h5>
                      <div className="text-left">
                        <p className="font-medium text-sm mb-1">
                          {
                            existingEntities.find(
                              (entity) => entity.id === selectedEntityId,
                            )?.name
                          }
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {
                            existingEntities.find(
                              (entity) => entity.id === selectedEntityId,
                            )?.description
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {!directCreateMode && (
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">
                      {editingData
                        ? `${labels.singular} bearbeiten`
                        : `Neue ${labels.singular} anlegen`}
                    </h3>
                  )}
                  {!directCreateMode && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-blue-800">
                            Nach dem Anlegen der {labels.singular} kannst du sie
                            hier verwalten:{" "}
                            <Link
                              to={labels.managementPath}
                              className="text-blue-700 hover:text-blue-900 underline decoration-2 hover:decoration-4 transition-all font-medium"
                            >
                              {labels.managementLabel}
                            </Link>{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="entity-name">
                        Name der {labels.singular}*
                      </Label>
                      <Input
                        id="entity-name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder={`Name der ${labels.singular}`}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="entity-description">Beschreibung</Label>
                      <Textarea
                        id="entity-description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder={`Beschreibung der ${labels.singular}`}
                        rows={4}
                        className="mt-2 min-h-[100px] resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {step === "selection" && (
            <Button variant="outline" onClick={handleClose}>
              <XIcon className="h-4 w-4 mr-2" />
              Abbrechen
            </Button>
          )}

          {step === "form" && (
            <>
              {!directCreateMode && (
                <Button variant="outline" onClick={() => setStep("selection")}>
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
              )}
              {directCreateMode && (
                <Button variant="outline" onClick={handleClose}>
                  <XIcon className="h-4 w-4 mr-2" />
                  Abbrechen
                </Button>
              )}
              <Button
                onClick={handleComplete}
                disabled={
                  (creationMode === "existing" && !selectedEntityId) ||
                  (creationMode === "new" && !formData.name.trim())
                }
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {editingData
                  ? "Speichern"
                  : directCreateMode
                    ? "Erstellen"
                    : "Hinzufügen"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EntityCreationModal;
