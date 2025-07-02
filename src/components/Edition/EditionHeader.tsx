import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon } from "lucide-react";

interface EditionHeaderProps {
  edition: any;
  saveChanges: () => void;
}

const EditionHeader: React.FC<EditionHeaderProps> = ({
  edition,
  saveChanges,
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">
                {edition?.title || "Neue Ausgabe"}
              </h1>
              <Badge variant={"outline"}>{edition?.status || "Entwurf"}</Badge>
            </div>
          </div>

          <Button onClick={saveChanges}>
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Änderungen speichern
          </Button>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default EditionHeader;
