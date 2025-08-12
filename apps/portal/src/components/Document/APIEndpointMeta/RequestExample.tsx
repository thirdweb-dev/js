"use client";

import { ExternalLinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RequestExample(props: {
  codeExamples: Array<{
    label: string;
    code: React.ReactElement;
    format?: "fetch" | "curl";
    exampleType?: string;
  }>;
  method: string;
  endpointUrl: string;
  referenceUrl: string;
  onExampleChange?: (label: string) => void;
  onFormatChange?: (format: "fetch" | "curl") => void;
  onExampleTypeChange?: (exampleType: string) => void;
  hasSeparateDropdowns?: boolean;
  selectedExample?: (typeof props.codeExamples)[0];
  selectedFormat?: "fetch" | "curl";
  selectedExampleType?: string;
}) {
  const [internalSelectedExample, setInternalSelectedExample] = useState(
    props.codeExamples[0],
  );
  const [internalSelectedFormat, setInternalSelectedFormat] = useState<
    "fetch" | "curl"
  >("fetch");
  const [internalSelectedExampleType, setInternalSelectedExampleType] =
    useState<string>("");

  // Use props values if provided, otherwise use internal state
  const selectedExample = props.selectedExample || internalSelectedExample;
  const selectedFormat = props.selectedFormat || internalSelectedFormat;
  const selectedExampleType =
    props.selectedExampleType || internalSelectedExampleType;

  // Initialize selected example type from first example (only for internal state)
  useEffect(() => {
    if (
      props.hasSeparateDropdowns &&
      props.codeExamples.length > 0 &&
      !props.selectedExampleType
    ) {
      const firstExampleType =
        props.codeExamples.find((ex) => ex.format === "fetch")?.exampleType ||
        "";
      setInternalSelectedExampleType(firstExampleType);
      // Set the initial selected example based on format and example type
      const initialExample = props.codeExamples.find(
        (ex) =>
          ex.format === selectedFormat && ex.exampleType === firstExampleType,
      );
      if (initialExample) {
        setInternalSelectedExample(initialExample);
      }
    }
  }, [
    props.hasSeparateDropdowns,
    props.codeExamples,
    selectedFormat,
    props.selectedExampleType,
  ]);

  return (
    <div>
      <div className="flex-col lg:flex-row flex items-start lg:items-center justify-between border-b px-4 py-2 gap-3 lg:gap-0">
        <div className="flex min-w-0 items-center gap-3">
          <Badge className="bg-inverted text-inverted-foreground">
            {props.method}
          </Badge>
          <span className="truncate font-mono text-sm">
            <a
              href={props.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline"
            >
              {props.endpointUrl}
              <ExternalLinkIcon className="size-3" />
            </a>
          </span>
        </div>
        {props.hasSeparateDropdowns ? (
          <div className="flex items-center gap-2">
            {/* Format Dropdown (Fetch/Curl) */}
            <Select
              onValueChange={(value: "fetch" | "curl") => {
                setInternalSelectedFormat(value);
                props.onFormatChange?.(value);
                // Update selected example based on format and example type
                const newExample = props.codeExamples.find(
                  (ex) =>
                    ex.format === value &&
                    ex.exampleType === selectedExampleType,
                );
                if (newExample) {
                  setInternalSelectedExample(newExample);
                }
              }}
              value={selectedFormat}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="fetch">Fetch</SelectItem>
                <SelectItem value="curl">Curl</SelectItem>
              </SelectContent>
            </Select>

            {/* Example Type Dropdown */}
            {(() => {
              const exampleTypes = [
                ...new Set(
                  props.codeExamples
                    .map((ex) => ex.exampleType)
                    .filter(Boolean),
                ),
              ];
              return exampleTypes.length > 1 ? (
                <Select
                  onValueChange={(value: string) => {
                    setInternalSelectedExampleType(value);
                    props.onExampleTypeChange?.(value);
                    // Update selected example based on format and example type
                    const newExample = props.codeExamples.find(
                      (ex) =>
                        ex.format === selectedFormat &&
                        ex.exampleType === value,
                    );
                    if (newExample) {
                      setInternalSelectedExample(newExample);
                    }
                  }}
                  value={selectedExampleType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {exampleTypes.map((exampleType) => (
                      <SelectItem key={exampleType} value={exampleType!}>
                        {exampleType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null;
            })()}
          </div>
        ) : (
          <Select
            onValueChange={(value: string) => {
              const example = props.codeExamples.find(
                (example) => example.label === value,
              );
              setInternalSelectedExample(example);
              props.onExampleChange?.(value);
            }}
            value={selectedExample?.label}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {props.codeExamples.map((example) => (
                <SelectItem key={example.label} value={example.label}>
                  {example.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div>{selectedExample?.code}</div>
    </div>
  );
}
