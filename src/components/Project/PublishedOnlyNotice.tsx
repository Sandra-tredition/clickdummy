import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InfoIcon, UnlockIcon } from "lucide-react";

interface PublishedOnlyNoticeProps {
  onUnlockForEditing: () => void;
}

const PublishedOnlyNotice: React.FC<PublishedOnlyNoticeProps> = ({
  onUnlockForEditing,
}) => {
  return (
    <Card className="mb-6 border-green-200 bg-green-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <InfoIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 mb-2">
              Alle Ausgaben sind veröffentlicht
            </h3>
            <p className="text-green-800 mb-4">
              Dieses Projekt hat nur veröffentlichte Ausgaben. Um Änderungen
              vorzunehmen oder neue Ausgaben hinzuzufügen, müssen Sie das
              Projekt zur Bearbeitung freischalten.
            </p>
            <Button
              onClick={onUnlockForEditing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <UnlockIcon className="h-4 w-4 mr-2" />
              Zur Bearbeitung freischalten
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublishedOnlyNotice;
