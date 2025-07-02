import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type AuthorType = {
  id: string;
  name: string;
  description?: string;
};

const authorTypes: AuthorType[] = [
  {
    id: "author",
    name: "Autor",
    description: "Verfasser des Werks",
  },
  {
    id: "translator",
    name: "Übersetzer",
    description: "Übersetzer des Werks",
  },
  {
    id: "editor",
    name: "Herausgeber",
    description: "Herausgeber des Werks",
  },
  {
    id: "illustrator",
    name: "Illustrator",
    description: "Illustrator des Werks",
  },
];

interface AuthorTypeSelectorProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

export function AuthorTypeSelector({
  selectedTypes,
  onChange,
}: AuthorTypeSelectorProps) {
  const toggleType = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      onChange(selectedTypes.filter((id) => id !== typeId));
    } else {
      onChange([...selectedTypes, typeId]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium mb-2">Nach Urheberart filtern:</div>
      <div className="flex flex-wrap gap-2">
        {authorTypes.map((type) => (
          <Button
            key={type.id}
            variant={selectedTypes.includes(type.id) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleType(type.id)}
            className="flex items-center gap-1"
          >
            {selectedTypes.includes(type.id) && (
              <Check className="h-3 w-3 mr-1" />
            )}
            {type.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
