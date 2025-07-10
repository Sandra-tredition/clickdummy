import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  CalendarIcon,
  FileTextIcon,
  ImageIcon,
  EuroIcon,
  BookOpenIcon,
  ClockIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  XIcon,
  EyeIcon,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Edition {
  id: string;
  title: string;
  produktform: string;
  ausgabenart?: string;
  price: number;
  pages?: number;
  status: string;
  is_complete: boolean;
  format_complete: boolean;
  content_complete: boolean;
  cover_complete: boolean;
  pricing_complete: boolean;
  authors_complete: boolean;
  isbn?: string;
}

interface PublishingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editions: Edition[];
  projectTitle: string;
  onPublish?: (publishingData: any) => void;
}

const PublishingModal: React.FC<PublishingModalProps> = ({
  isOpen,
  onOpenChange,
  editions,
  projectTitle,
  onPublish,
}) => {
  // State for selected editions
  const [selectedEditions, setSelectedEditions] = useState<string[]>([]);

  // State for print approvals
  const [printApprovals, setPrintApprovals] = useState<{
    [editionId: string]: {
      contentApproved: boolean;
      coverApproved: boolean;
      contentViewed: boolean;
      coverViewed: boolean;
    };
  }>({});

  // State for publication timing
  const [publicationTiming, setPublicationTiming] = useState<
    "immediate" | "scheduled"
  >("immediate");
  const [scheduledDate, setScheduledDate] = useState<string>("");

  // State for legal confirmations
  const [legalConfirmations, setLegalConfirmations] = useState({
    agbAccepted: false,
    rightsConfirmed: false,
    catalogAwareness: false,
  });

  // State for current step
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);

  // Filter publishable editions (complete and not already published)
  const publishableEditions = editions.filter(
    (edition) =>
      edition.is_complete &&
      edition.status !== "Veröffentlicht" &&
      edition.status !== "Im Verkauf",
  );

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedEditions([]);
      setPrintApprovals({});
      setPublicationTiming("immediate");
      setScheduledDate("");
      setLegalConfirmations({
        agbAccepted: false,
        rightsConfirmed: false,
        catalogAwareness: false,
      });
      setCurrentStep(1);
      setIsPublishing(false);
    }
  }, [isOpen]);

  // Handle edition selection
  const handleEditionToggle = (editionId: string) => {
    setSelectedEditions((prev) => {
      const newSelection = prev.includes(editionId)
        ? prev.filter((id) => id !== editionId)
        : [...prev, editionId];

      // Initialize print approvals for newly selected editions
      if (!prev.includes(editionId)) {
        setPrintApprovals((prevApprovals) => ({
          ...prevApprovals,
          [editionId]: {
            contentApproved: false,
            coverApproved: false,
            contentViewed: false,
            coverViewed: false,
          },
        }));
      }

      return newSelection;
    });
  };

  // Handle print approval changes
  const handlePrintApprovalChange = (
    editionId: string,
    type: "contentApproved" | "coverApproved" | "contentViewed" | "coverViewed",
    value: boolean,
  ) => {
    setPrintApprovals((prev) => ({
      ...prev,
      [editionId]: {
        ...prev[editionId],
        [type]: value,
      },
    }));
  };

  // Handle legal confirmation changes
  const handleLegalConfirmationChange = (
    type: keyof typeof legalConfirmations,
    value: boolean,
  ) => {
    setLegalConfirmations((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Check if current step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedEditions.length > 0;
      case 2:
        return selectedEditions.every(
          (editionId) =>
            printApprovals[editionId]?.contentApproved &&
            printApprovals[editionId]?.coverApproved &&
            printApprovals[editionId]?.contentViewed &&
            printApprovals[editionId]?.coverViewed,
        );
      case 3:
        return (
          publicationTiming === "immediate" ||
          (publicationTiming === "scheduled" && scheduledDate !== "")
        );
      case 4:
        return (
          legalConfirmations.agbAccepted &&
          legalConfirmations.rightsConfirmed &&
          legalConfirmations.catalogAwareness
        );
      default:
        return false;
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (isStepValid() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle final publishing
  const handlePublish = async () => {
    if (!isStepValid()) return;

    setIsPublishing(true);

    try {
      const publishingData = {
        selectedEditions,
        printApprovals,
        publicationTiming,
        scheduledDate: publicationTiming === "scheduled" ? scheduledDate : null,
        legalConfirmations,
        timestamp: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      onPublish?.(publishingData);

      toast({
        title: "Veröffentlichung erfolgreich",
        description: `${selectedEditions.length} Ausgabe(n) ${publicationTiming === "immediate" ? "wurden veröffentlicht" : "sind zur Veröffentlichung geplant"}.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Publishing error:", error);
      toast({
        title: "Fehler bei der Veröffentlichung",
        description: "Die Veröffentlichung konnte nicht abgeschlossen werden.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Get edition by ID
  const getEditionById = (id: string) => {
    return publishableEditions.find((edition) => edition.id === id);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <BookOpenIcon className="h-6 w-6 text-green-600" />
            Projekt veröffentlichen
          </DialogTitle>
          <DialogDescription className="text-base">
            Veröffentliche ausgewählte Ausgaben von &quot;{projectTitle}&quot;
          </DialogDescription>

          {/* Progress indicator */}
          <div className="flex items-center justify-between mt-4 px-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircleIcon className="h-4 w-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step labels */}
          <div className="flex justify-between text-xs text-gray-600 mt-2 px-1">
            <span>Ausgaben</span>
            <span>Freigaben</span>
            <span>Zeitpunkt</span>
            <span>Bestätigung</span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Edition Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BookOpenIcon className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Ausgaben auswählen</h3>
              </div>

              {publishableEditions.length === 0 ? (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <AlertCircleIcon className="h-5 w-5 text-amber-600" />
                      <p className="text-amber-800">
                        Keine veröffentlichungsfähigen Ausgaben vorhanden.
                        Stelle sicher, dass alle Ausgaben vollständig sind.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {publishableEditions.map((edition) => (
                    <Card
                      key={edition.id}
                      className={`cursor-pointer transition-all ${
                        selectedEditions.includes(edition.id)
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleEditionToggle(edition.id)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={selectedEditions.includes(edition.id)}
                              onChange={() => handleEditionToggle(edition.id)}
                              className="mt-1"
                            />
                            <div className="space-y-2">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {edition.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {edition.produktform}
                                  </Badge>
                                  {edition.ausgabenart && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {edition.ausgabenart}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <EuroIcon className="h-3 w-3" />
                                  <span>{edition.price.toFixed(2)}</span>
                                </div>
                                {edition.pages && (
                                  <div className="flex items-center gap-1">
                                    <FileTextIcon className="h-3 w-3" />
                                    <span>{edition.pages} Seiten</span>
                                  </div>
                                )}
                                {edition.isbn && (
                                  <div className="text-xs text-gray-500">
                                    ISBN: {edition.isbn}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">
                              Bereit
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Print Approvals */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Druckfreigaben</h3>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <EyeIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Wichtiger Hinweis zur Freigabe
                    </p>
                    <p className="text-sm text-blue-800">
                      Du musst dir zuerst den Innenteil und das Cover jeder
                      Ausgabe ansehen, bevor du die Freigabe erteilen kannst.
                      Dies stellt sicher, dass alle Inhalte vor der
                      Veröffentlichung geprüft wurden.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {selectedEditions.map((editionId) => {
                  const edition = getEditionById(editionId);
                  if (!edition) return null;

                  return (
                    <Card key={editionId} className="border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          {edition.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Content Section */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FileTextIcon className="h-4 w-4 text-gray-600" />
                            <h4 className="font-medium text-gray-900">
                              Innenteil
                            </h4>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Simulate viewing content
                                  handlePrintApprovalChange(
                                    editionId,
                                    "contentViewed",
                                    true,
                                  );
                                  // In a real app, this would open a preview modal or PDF viewer
                                  alert(
                                    `Innenteil von "${edition.title}" wird angezeigt...`,
                                  );
                                }}
                                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                Innenteil ansehen
                              </Button>
                              {printApprovals[editionId]?.contentViewed && (
                                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                  <CheckCircleIcon className="h-4 w-4" />
                                  Angesehen
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={`content-${editionId}`}
                                checked={
                                  printApprovals[editionId]?.contentApproved ||
                                  false
                                }
                                disabled={
                                  !printApprovals[editionId]?.contentViewed
                                }
                                onCheckedChange={(checked) =>
                                  handlePrintApprovalChange(
                                    editionId,
                                    "contentApproved",
                                    checked as boolean,
                                  )
                                }
                              />
                              <Label
                                htmlFor={`content-${editionId}`}
                                className={`text-sm font-medium cursor-pointer ${
                                  !printApprovals[editionId]?.contentViewed
                                    ? "text-gray-400"
                                    : "text-gray-900"
                                }`}
                              >
                                Innenteil freigeben
                              </Label>
                            </div>
                          </div>
                        </div>

                        {/* Cover Section */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-gray-600" />
                            <h4 className="font-medium text-gray-900">Cover</h4>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Simulate viewing cover
                                  handlePrintApprovalChange(
                                    editionId,
                                    "coverViewed",
                                    true,
                                  );
                                  // In a real app, this would open a preview modal or image viewer
                                  alert(
                                    `Cover von "${edition.title}" wird angezeigt...`,
                                  );
                                }}
                                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                Cover ansehen
                              </Button>
                              {printApprovals[editionId]?.coverViewed && (
                                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                  <CheckCircleIcon className="h-4 w-4" />
                                  Angesehen
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={`cover-${editionId}`}
                                checked={
                                  printApprovals[editionId]?.coverApproved ||
                                  false
                                }
                                disabled={
                                  !printApprovals[editionId]?.coverViewed
                                }
                                onCheckedChange={(checked) =>
                                  handlePrintApprovalChange(
                                    editionId,
                                    "coverApproved",
                                    checked as boolean,
                                  )
                                }
                              />
                              <Label
                                htmlFor={`cover-${editionId}`}
                                className={`text-sm font-medium cursor-pointer ${
                                  !printApprovals[editionId]?.coverViewed
                                    ? "text-gray-400"
                                    : "text-gray-900"
                                }`}
                              >
                                Cover freigeben
                              </Label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Publication Timing */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ClockIcon className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">
                  Veröffentlichungszeitpunkt
                </h3>
              </div>

              <RadioGroup
                value={publicationTiming}
                onValueChange={(value) =>
                  setPublicationTiming(value as "immediate" | "scheduled")
                }
                className="space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="immediate" id="immediate" />
                  <Label htmlFor="immediate" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Sofort veröffentlichen</div>
                      <div className="text-sm text-gray-600">
                        Die Ausgaben werden unmittelbar nach der Bestätigung
                        veröffentlicht.
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <RadioGroupItem
                    value="scheduled"
                    id="scheduled"
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="scheduled" className="cursor-pointer">
                      <div className="mb-3">
                        <div className="font-medium">
                          Geplante Veröffentlichung
                        </div>
                        <div className="text-sm text-gray-600">
                          Wähle ein Datum für die automatische Veröffentlichung.
                        </div>
                      </div>
                    </Label>

                    {publicationTiming === "scheduled" && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="scheduled-date"
                          className="text-sm font-medium"
                        >
                          Veröffentlichungsdatum
                        </Label>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-600" />
                          <Input
                            id="scheduled-date"
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            min={getMinDate()}
                            className="w-auto"
                          />
                        </div>
                        {scheduledDate && (
                          <p className="text-sm text-gray-600">
                            Veröffentlichung am: {formatDate(scheduledDate)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 4: Legal Confirmations */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">
                  Rechtliche Bestätigungen
                </h3>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Bitte bestätige die folgenden rechtlichen Aspekte vor der
                Veröffentlichung.
              </p>

              <div className="space-y-6">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agb"
                        checked={legalConfirmations.agbAccepted}
                        onCheckedChange={(checked) =>
                          handleLegalConfirmationChange(
                            "agbAccepted",
                            checked as boolean,
                          )
                        }
                        className="mt-1"
                      />
                      <div>
                        <Label
                          htmlFor="agb"
                          className="font-medium cursor-pointer"
                        >
                          Allgemeine Geschäftsbedingungen
                        </Label>
                        <p className="text-sm text-gray-700 mt-1">
                          Ich akzeptiere die AGB und bin mit den
                          Veröffentlichungsbedingungen einverstanden.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="rights"
                        checked={legalConfirmations.rightsConfirmed}
                        onCheckedChange={(checked) =>
                          handleLegalConfirmationChange(
                            "rightsConfirmed",
                            checked as boolean,
                          )
                        }
                        className="mt-1"
                      />
                      <div>
                        <Label
                          htmlFor="rights"
                          className="font-medium cursor-pointer"
                        >
                          Rechteinhaberschaft
                        </Label>
                        <p className="text-sm text-gray-700 mt-1">
                          Ich bestätige, dass ich alle erforderlichen Rechte
                          innehabe, um die Inhalte zu veröffentlichen, und dass
                          keine Urheberrechte Dritter verletzt werden.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="catalog"
                        checked={legalConfirmations.catalogAwareness}
                        onCheckedChange={(checked) =>
                          handleLegalConfirmationChange(
                            "catalogAwareness",
                            checked as boolean,
                          )
                        }
                        className="mt-1"
                      />
                      <div>
                        <Label
                          htmlFor="catalog"
                          className="font-medium cursor-pointer"
                        >
                          Katalog-Listung
                        </Label>
                        <p className="text-sm text-gray-700 mt-1">
                          Mir ist bewusst, dass Bücher, die einmal in
                          Online-Katalogen der Buchhändler gelistet waren, dort
                          nicht mehr gelöscht werden können, sondern lediglich
                          deaktiviert werden können.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPublishing}
            >
              <XIcon className="h-4 w-4 mr-2" />
              Abbrechen
            </Button>

            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={isPublishing}
              >
                Zurück
              </Button>
            )}
          </div>

          <div>
            {currentStep < 4 ? (
              <Button
                onClick={handleNextStep}
                disabled={!isStepValid() || isPublishing}
                variant="primary"
              >
                Weiter
              </Button>
            ) : (
              <Button
                onClick={handlePublish}
                disabled={!isStepValid() || isPublishing}
                variant="primary"
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Veröffentliche...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Jetzt veröffentlichen
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishingModal;
