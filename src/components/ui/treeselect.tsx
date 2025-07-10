import * as React from "react";
import { Check, ChevronDown, ChevronRight, X } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}

interface TreeSelectProps {
  options: TreeNode[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const TreeSelect = ({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  className,
}: TreeSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(
    new Set(),
  );

  const toggleNode = (value: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(value)) {
      newExpanded.delete(value);
    } else {
      newExpanded.add(value);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleSelection = (value: string) => {
    const newSelected = [...selected];
    const index = newSelected.indexOf(value);
    if (index === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(index, 1);
    }
    onChange(newSelected);
  };

  const removeSelection = (value: string) => {
    const newSelected = selected.filter((item) => item !== value);
    onChange(newSelected);
  };

  const renderTreeNodes = (nodes: TreeNode[], level = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.value);
      const isSelected = selected.includes(node.value);

      return (
        <React.Fragment key={node.value}>
          <div
            className={cn(
              "flex items-center px-2 py-1.5 hover:bg-accent/50 cursor-pointer",
              isSelected && "bg-accent",
              level > 0 && "ml-4",
            )}
          >
            {hasChildren ? (
              <div
                className="mr-1 h-4 w-4 shrink-0 text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.value);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            ) : (
              <div className="mr-1 w-4" />
            )}
            <div
              className="flex-1 flex items-center"
              onClick={() => toggleSelection(node.value)}
            >
              <div
                className={cn(
                  "mr-2 h-4 w-4 rounded-sm border border-primary flex items-center justify-center",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50",
                )}
              >
                {isSelected && <Check className="h-3 w-3" />}
              </div>
              {node.label}
            </div>
          </div>
          {hasChildren &&
            isExpanded &&
            renderTreeNodes(node.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  // Find all selected node labels
  const findSelectedLabels = (
    nodes: TreeNode[],
    values: string[],
  ): string[] => {
    let labels: string[] = [];

    for (const node of nodes) {
      if (values.includes(node.value)) {
        labels.push(node.label);
      }

      if (node.children && node.children.length > 0) {
        labels = [...labels, ...findSelectedLabels(node.children, values)];
      }
    }

    return labels;
  };

  const selectedLabels = findSelectedLabels(options, selected);

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className="flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selected.length > 0 ? (
            selectedLabels.map((label, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelection(selected[index]);
                  }}
                />
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <div className="ml-2 flex items-center self-center">
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="p-1">{renderTreeNodes(options)}</div>
          <div className="sticky bottom-0 bg-white border-t p-2">
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Fertig
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
