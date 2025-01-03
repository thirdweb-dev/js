"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Copy, Minus, Plus } from "lucide-react";
import React from "react";

const sectionClass =
  "pt-6 mt-6 border-t border-border first:pt-0 first:mt-0 first:border-t-0";

interface NestedParameter {
  name: string;
  required: boolean;
  description: string;
  type: string;
  properties?: NestedParameter[];
}

interface Parameter extends NestedParameter {}

interface Header {
  name: string;
  required: boolean;
  description: string;
  type: string;
}

interface ApiResponse {
  status: string;
  description: string;
  code: string;
}

interface CodeExample {
  language: string;
  code: string;
}

interface ApiEndpointProps {
  title: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  description: string;
  endpointUrl: string;
  parameters: Parameter[];
  headers: Header[];
  bodyParameters: Parameter[];
  codeExamples: CodeExample[];
  apiResponses: ApiResponse[];
}

function ParameterItem({
  param,
  depth = 0,
}: { param: NestedParameter; depth?: number }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className={`space-y-2 border-border border-b pb-4 last:border-b-0 last:pb-0 ${depth > 0 ? "ml-4" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <code className="relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {param.name}
          </code>
          <Badge variant={param.required ? "destructive" : "secondary"}>
            {param.required ? "required" : "optional"}
          </Badge>
          <span className="text-muted-foreground text-sm">{param.type}</span>
        </div>
        {param.properties && param.properties.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <Minus className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <p className="text-muted-foreground text-sm">{param.description}</p>
      {isOpen && param.properties && (
        <div className="mt-2 space-y-2">
          {param.properties.map((subParam) => (
            <ParameterItem
              key={subParam.name}
              param={subParam}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ApiEndpoint({
  title,
  method,
  description,
  endpointUrl,
  parameters,
  headers,
  bodyParameters,
  codeExamples,
  apiResponses,
}: ApiEndpointProps) {
  const [isHeadersOpen, setIsHeadersOpen] = React.useState(true);
  const [isQueryParametersOpen, setIsQueryParametersOpen] =
    React.useState(true);
  const [isBodyParametersOpen, setIsBodyParametersOpen] = React.useState(true);
  const [selectedLanguage, setSelectedLanguage] = React.useState(
    codeExamples[0]?.language,
  );

  const toggleHeaders = () => {
    setIsHeadersOpen(!isHeadersOpen);
  };

  const toggleQueryParameters = () => {
    setIsQueryParametersOpen(!isQueryParametersOpen);
  };

  const toggleBodyParameters = () => {
    setIsBodyParametersOpen(!isBodyParametersOpen);
  };

  const methodColors = {
    GET: "bg-blue-500",
    POST: "bg-green-500",
    PUT: "bg-yellow-500",
    DELETE: "bg-red-500",
    PATCH: "bg-purple-500",
  };

  const getResponseType = (status: string) => {
    const statusCode = Number.parseInt(status, 10);
    return statusCode >= 200 && statusCode < 300 ? "success" : "error";
  };

  const getCodeExample = (language: string) => {
    return (
      codeExamples.find((example) => example.language === language)?.code || ""
    );
  };

  return (
    <div className="grid items-start gap-10 md:grid-cols-2">
      <div className="space-y-8">
        <div className={sectionClass}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-2xl tracking-tight">{title}</h2>
              <Badge className={`${methodColors[method]} text-white`}>
                {method}
              </Badge>
            </div>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        {headers.length > 0 && (
          <div className={sectionClass}>
            <Collapsible open={isHeadersOpen} onOpenChange={toggleHeaders}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-l tracking-tight">HEADERS</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    {isHeadersOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle headers</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-4 space-y-4">
                {headers.map((header) => (
                  <div
                    key={header.name}
                    className="space-y-2 border-border border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <code className="relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        {header.name}
                      </code>
                      <Badge
                        variant={header.required ? "destructive" : "secondary"}
                      >
                        {header.required ? "required" : "optional"}
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        {header.type}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {header.description}
                    </p>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {parameters.length > 0 && (
          <div className={sectionClass}>
            <Collapsible
              open={isQueryParametersOpen}
              onOpenChange={toggleQueryParameters}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-l tracking-tight">
                  QUERY PARAMS
                </h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    {isQueryParametersOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle query parameters</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-4 space-y-4">
                {parameters.map((param) => (
                  <ParameterItem key={param.name} param={param} />
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {bodyParameters.length > 0 && (
          <div className={sectionClass}>
            <Collapsible
              open={isBodyParametersOpen}
              onOpenChange={toggleBodyParameters}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-l tracking-tight">
                  BODY PARAMS
                </h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    {isBodyParametersOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle body parameters</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-4 space-y-4">
                {bodyParameters.map((param) => (
                  <ParameterItem key={param.name} param={param} />
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <div className={`${sectionClass} rounded-lg border bg-muted/50`}>
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${methodColors[method]} border-none bg-opacity-10`}
              >
                {method}
              </Badge>
              <code className="relative rounded font-mono text-sm">
                {endpointUrl}
              </code>
            </div>
            <Select
              value={selectedLanguage}
              onValueChange={(value: string) => setSelectedLanguage(value)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {codeExamples.map((example) => (
                  <SelectItem key={example.language} value={example.language}>
                    {example.language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedLanguage && (
            <div className="relative">
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      getCodeExample(selectedLanguage),
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy code example</span>
                </Button>
              </div>
              <pre className="overflow-x-auto p-4">
                <code className="font-mono text-sm">
                  {getCodeExample(selectedLanguage)}
                </code>
              </pre>
            </div>
          )}
        </div>

        <div className={`${sectionClass} rounded-lg border bg-muted/50`}>
          <Tabs defaultValue={apiResponses[0]?.status} className="w-full">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-semibold text-l tracking-tight">Response</h3>
              <TabsList>
                {apiResponses.map((response) => (
                  <TabsTrigger
                    key={response.status}
                    value={response.status}
                    className="data-[state=active]:bg-background"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${getResponseType(response.status) === "success" ? "bg-green-500" : "bg-red-500"}`}
                      />
                      {response.status}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {apiResponses.map((response) => (
              <TabsContent key={response.status} value={response.status}>
                <div className="p-4">
                  <p className="mb-2 text-muted-foreground text-sm">
                    {response.description}
                  </p>
                  <div className="relative">
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          navigator.clipboard.writeText(response.code)
                        }
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy code</span>
                      </Button>
                    </div>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4">
                      <code className="font-mono text-sm">{response.code}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
