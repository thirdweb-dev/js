"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CodeClient, { CodeLoading } from "../../code/code.client";
import { Details } from "../Details";
import type { APIParameter } from "./ApiEndpoint";
import { RequestExample } from "./RequestExample";

interface DynamicRequestExampleProps {
  requestExamples: Array<{
    lang: "javascript" | "bash";
    code: string;
    label: string;
    format: "fetch" | "curl";
    exampleType?: string;
    bodyParameters?: APIParameter[];
  }>;
  endpointUrl: string;
  referenceUrl: string;
  method: string;
  pathParameters: APIParameter[];
  headers: APIParameter[];
  queryParameters: APIParameter[];
  hasMultipleExamples: boolean;
}

function InlineParameterItem({ param }: { param: APIParameter }) {
  return (
    <div className="flex flex-col gap-2 p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-2 flex-wrap">
        <code className="text-foreground text-sm font-mono bg-background px-2 py-1 rounded border">
          {param.name}
        </code>
        {param.type && (
          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
            {param.type}
          </span>
        )}
        {param.required && (
          <span className="text-xs text-warning-text px-2 py-1 rounded border border-warning-text">
            Required
          </span>
        )}
      </div>

      {param.description && (
        <div className="text-sm text-muted-foreground">{param.description}</div>
      )}

      {param.example !== undefined && (
        <div className="text-sm flex flex-col gap-2">
          <span className="text-muted-foreground">Example: </span>
          <CodeClient
            code={
              typeof param.example === "object"
                ? JSON.stringify(param.example)
                : String(param.example)
            }
            className="rounded-none border-none"
            lang="json"
            loader={<CodeLoading />}
            scrollableContainerClassName="m-0"
            scrollableClassName="max-h-[200px]"
          />
        </div>
      )}
    </div>
  );
}

function ParameterSection(props: {
  title: string;
  parameters: APIParameter[];
}) {
  if (props.parameters.length === 0) return null;

  return (
    <div className="border-b last:border-b-0">
      <Details
        key={props.title}
        summary={
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{props.title}</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {props.parameters.length}
            </span>
          </div>
        }
        accordionItemClassName="border-0 my-0"
        accordionTriggerClassName="p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="px-4 pb-4">
          {props.parameters
            .sort((a, b) => {
              if (a.required === b.required) {
                return 0;
              }
              return a.required ? -1 : 1;
            })
            .map((param) => (
              <InlineParameterItem key={param.name} param={param} />
            ))}
        </div>
      </Details>
    </div>
  );
}

const queryClient = new QueryClient();

export function DynamicRequestExample(props: DynamicRequestExampleProps) {
  const [selectedFormat, setSelectedFormat] = useState<"fetch" | "curl">(
    "fetch",
  );
  const [selectedExampleType, setSelectedExampleType] = useState<string>("");

  // Initialize selected example type from first available example
  useEffect(() => {
    if (props.requestExamples.length > 0) {
      const firstExampleType =
        props.requestExamples.find((ex) => ex.format === "fetch")
          ?.exampleType || "";
      setSelectedExampleType(firstExampleType);
    }
  }, [props.requestExamples]);

  // Get the current example based on selected format and example type
  const selectedExample =
    props.requestExamples.find(
      (ex) =>
        ex.format === selectedFormat && ex.exampleType === selectedExampleType,
    ) ||
    props.requestExamples.find((ex) => ex.format === selectedFormat) ||
    props.requestExamples[0];

  // Get the current body parameters based on selected example
  const currentBodyParameters = selectedExample?.bodyParameters || [];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="rounded-lg border">
        <RequestExample
          codeExamples={props.requestExamples.map((example) => ({
            code: (
              <CodeClient
                className="rounded-none border-none"
                code={example.code}
                loader={<CodeLoading />}
                scrollableContainerClassName="m-0"
                lang={example.lang}
              />
            ),
            label: example.label,
            format: example.format,
            exampleType: example.exampleType,
          }))}
          endpointUrl={props.endpointUrl}
          referenceUrl={props.referenceUrl}
          method={props.method}
          hasSeparateDropdowns={props.hasMultipleExamples}
          selectedExample={
            selectedExample
              ? {
                  code: (
                    <CodeClient
                      className="rounded-none border-none"
                      code={selectedExample.code}
                      loader={<CodeLoading />}
                      scrollableContainerClassName="m-0"
                      lang={selectedExample.lang}
                    />
                  ),
                  label: selectedExample.label,
                  format: selectedExample.format,
                  exampleType: selectedExample.exampleType,
                }
              : undefined
          }
          selectedFormat={selectedFormat}
          selectedExampleType={selectedExampleType}
          onFormatChange={(format) => {
            setSelectedFormat(format);
          }}
          onExampleTypeChange={(exampleType) => {
            setSelectedExampleType(exampleType);
          }}
        />

        {/* Parameters section inside the card */}
        <div className="border-t">
          <ParameterSection parameters={props.headers} title="Headers" />
          <ParameterSection
            parameters={props.pathParameters}
            title="Path Parameters"
          />
          <ParameterSection
            parameters={props.queryParameters}
            title="Query Parameters"
          />
          <ParameterSection
            parameters={currentBodyParameters}
            title="Request Body"
          />
        </div>
      </div>
    </QueryClientProvider>
  );
}
