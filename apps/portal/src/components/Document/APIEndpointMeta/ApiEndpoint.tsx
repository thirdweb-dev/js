import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "../../../lib/utils";
import { CodeBlock } from "../Code";
import { Details } from "../Details";
import { Heading } from "../Heading";
import { DynamicRequestExample } from "./DynamicRequestExample";
import { RequestExample } from "./RequestExample";

export type APIParameter = {
  name: string;
  required: boolean;
  description: React.ReactNode;
  type?: string;
  example?:
    | string
    | boolean
    | number
    | object
    | Array<string | boolean | number | object>;
};

type RequestExampleType = {
  title: string;
  bodyParameters: APIParameter[];
};

export type ApiEndpointMeta = {
  title: string;
  description: React.ReactNode;
  referenceUrl: string;
  path: string;
  origin: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  request: {
    pathParameters: APIParameter[];
    headers: APIParameter[];
    queryParameters: APIParameter[];
    bodyParameters: APIParameter[];
    // Support for multiple request examples (oneOf schemas)
    requestExamples?: RequestExampleType[];
  };
  responseExamples: Record<string, string>;
};

export function ApiEndpoint(props: { metadata: ApiEndpointMeta }) {
  const { responseExamples, request } = props.metadata;

  // If we have multiple request examples (oneOf schemas), create code examples for each
  const requestExamples: Array<{
    lang: "javascript" | "bash";
    code: string;
    label: string;
    format: "fetch" | "curl";
    exampleType?: string;
    bodyParameters?: APIParameter[];
  }> = [];

  if (request.requestExamples && request.requestExamples.length > 0) {
    // Create examples for each oneOf schema
    for (const requestExample of request.requestExamples) {
      const metadataWithExample = {
        ...props.metadata,
        request: {
          ...request,
          bodyParameters: requestExample.bodyParameters,
        },
      };

      requestExamples.push(
        {
          code: createFetchCommand({ metadata: metadataWithExample }),
          label: `Fetch - ${requestExample.title}`,
          lang: "javascript",
          format: "fetch",
          exampleType: requestExample.title,
          bodyParameters: requestExample.bodyParameters,
        },
        {
          code: createCurlCommand({ metadata: metadataWithExample }),
          label: `Curl - ${requestExample.title}`,
          lang: "bash",
          format: "curl",
          exampleType: requestExample.title,
          bodyParameters: requestExample.bodyParameters,
        },
      );
    }
  } else {
    // Default single example
    requestExamples.push(
      {
        code: createFetchCommand({ metadata: props.metadata }),
        label: "Fetch",
        lang: "javascript",
        format: "fetch",
        bodyParameters: request.bodyParameters,
      },
      {
        code: createCurlCommand({ metadata: props.metadata }),
        label: "Curl",
        lang: "bash",
        format: "curl",
        bodyParameters: request.bodyParameters,
      },
    );
  }

  const responseKeys = Object.keys(responseExamples);

  return (
    <div>
      <div>
        <Heading
          anchorId={`request#${props.metadata.method.toLowerCase()}${props.metadata.path}`}
          level={3}
        >
          Request
        </Heading>

        {/* Use DynamicRequestExample for multiple examples, regular for single */}
        {request.requestExamples && request.requestExamples.length > 0 ? (
          <DynamicRequestExample
            requestExamples={requestExamples}
            endpointUrl={props.metadata.path}
            referenceUrl={props.metadata.referenceUrl}
            method={props.metadata.method}
            pathParameters={request.pathParameters}
            headers={request.headers}
            queryParameters={request.queryParameters}
            hasMultipleExamples={true}
          />
        ) : (
          <div className="rounded-lg border bg-card">
            <RequestExample
              codeExamples={requestExamples.map((example) => ({
                code: (
                  <CodeBlock
                    className="rounded-none border-none !bg-card"
                    code={example.code}
                    containerClassName="m-0"
                    lang={example.lang}
                  />
                ),
                label: example.label,
              }))}
              endpointUrl={props.metadata.path}
              referenceUrl={props.metadata.referenceUrl}
              method={props.metadata.method}
            />

            {/* Parameters section inside the card */}
            <div className="border-t">
              {request.headers.length > 0 && (
                <ParameterSection
                  parameters={request.headers}
                  title="Headers"
                />
              )}

              {request.pathParameters.length > 0 && (
                <ParameterSection
                  parameters={request.pathParameters}
                  title="Path Parameters"
                />
              )}

              {request.queryParameters.length > 0 && (
                <ParameterSection
                  parameters={request.queryParameters}
                  title="Query Parameters"
                />
              )}

              {request.bodyParameters.length > 0 && (
                <ParameterSection
                  parameters={request.bodyParameters}
                  title="Request Body"
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <Heading
          anchorId={`response#${props.metadata.method.toLowerCase()}${props.metadata.path}`}
          className="text-lg lg:text-lg"
          level={3}
        >
          Response
        </Heading>
        <div className="overflow-hidden rounded-lg border bg-card">
          <Tabs className="w-full" defaultValue={responseKeys[0]}>
            <TabsList className="w-full pt-1">
              {responseKeys.map((status) => (
                <TabsTrigger key={status} value={status}>
                  <div className="flex items-center gap-1.5 px-0.5">
                    <span
                      className={cn("h-2 w-2 rounded-full", {
                        "bg-green-500": status.startsWith("2"),
                        "bg-red-500": status.startsWith("4"),
                        "bg-orange-500": status.startsWith("3"),
                        "bg-yellow-500": status.startsWith("5"),
                      })}
                    />
                    <span className="text-sm">{status}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {responseKeys.map((status) => (
              <TabsContent className="m-0" key={status} value={status}>
                <CodeBlock
                  className="rounded-none border-none !bg-card"
                  code={responseExamples[status] as string}
                  containerClassName="m-0"
                  lang="json"
                  scrollContainerClassName="max-h-[600px]"
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ParameterSection(props: {
  title: string;
  parameters: APIParameter[];
}) {
  return (
    <div className="border-b last:border-b-0">
      <Details
        summary={
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{props.title}</span>
            <span className="text-xs text-muted-foreground bg-muted size-6 rounded-full inline-flex justify-center items-center">
              {props.parameters.length}
            </span>
          </div>
        }
        accordionItemClassName="border-0 my-0"
        accordionTriggerClassName="p-4 hover:bg-muted/50 transition-colors"
        headingClassName="!no-underline"
      >
        <div className="px-4 pb-4 space-y-2">
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

function InlineParameterItem({ param }: { param: APIParameter }) {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex items-center gap-2 flex-wrap">
        <code className="text-foreground text-base font-mono font-medium">
          {param.name}
        </code>
        {param.type && (
          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-lg">
            {param.type}
          </span>
        )}
        {param.required && (
          <span className="text-xs text-warning-text px-2 py-1 rounded-lg border border-warning-text/30 bg-warning-text/15">
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
          <CodeBlock
            className="!bg-card"
            code={
              typeof param.example === "object"
                ? JSON.stringify(param.example)
                : String(param.example)
            }
            containerClassName="m-0"
            lang="json"
            scrollContainerClassName="max-h-[200px]"
          />
        </div>
      )}
    </div>
  );
}

function createCurlCommand(params: { metadata: ApiEndpointMeta }) {
  let url = `${params.metadata.origin}${params.metadata.path}`;
  const bodyObj: Record<string, string | number | boolean | object> = {};

  // Add query parameters to URL
  const queryParams = params.metadata.request.queryParameters
    .filter((q) => q.example !== undefined)
    .map((q) => `${q.name}=${encodeURIComponent(String(q.example))}`)
    .join("&");

  if (queryParams) {
    url += `?${queryParams}`;
  }

  const displayHeaders = params.metadata.request.headers.filter(
    (h) => h.example !== undefined,
  );

  // always show secret key header in examples
  displayHeaders.push({
    name: "x-secret-key",
    example: "<your-project-secret-key>",
    description:
      "Project secret key - for backend usage only. Should not be used in frontend code.",
    required: false,
  });

  const headers = displayHeaders
    .map((h) => {
      return `-H "${h.name}:${
        typeof h.example === "object" && h !== null
          ? JSON.stringify(h.example)
          : h.example
      }"`;
    })
    .join(" \\\n");

  for (const param of params.metadata.request.bodyParameters) {
    if (param.example !== undefined) {
      bodyObj[param.name] = param.example;
    }
  }

  const body =
    Object.keys(bodyObj).length === 0
      ? ""
      : `-d '${JSON.stringify(bodyObj, null, 2)}'`;

  const requestData = [url, headers, body].filter((s) => s).join(" \\\n");

  return `curl -X ${params.metadata.method} ${requestData}`;
}

function createFetchCommand(params: { metadata: ApiEndpointMeta }) {
  const headersObj: Record<string, string | number | boolean | object> = {};
  const bodyObj: Record<string, string | number | boolean | object> = {};
  const { request } = params.metadata;
  let url = `${params.metadata.origin}${params.metadata.path}`;

  // Add query parameters to URL
  const queryParams = request.queryParameters
    .filter((q) => q.example !== undefined)
    .map((q) => `${q.name}=${encodeURIComponent(String(q.example))}`)
    .join("&");

  if (queryParams) {
    url += `?${queryParams}`;
  }

  const displayHeaders = request.headers.filter((h) => h.example !== undefined);

  // always show secret key header in examples
  if (params.metadata.path.includes("/v1/auth")) {
    displayHeaders.push({
      name: "x-client-id",
      example: "<your-project-client-id>",
      description:
        "Project client ID - for frontend usage on authorized domains.",
      required: false,
    });
  } else {
    displayHeaders.push({
      name: "x-secret-key",
      example: "<your-project-secret-key>",
      description:
        "Project secret key - for backend usage only. Should not be used in frontend code.",
      required: false,
    });
  }

  for (const param of displayHeaders) {
    if (param.example !== undefined) {
      headersObj[param.name] = param.example;
    }
  }

  for (const param of request.bodyParameters) {
    if (param.example !== undefined) {
      bodyObj[param.name] = param.example;
    } else {
      bodyObj[param.name] = param.type || "";
    }
  }

  const fetchOptions: Record<string, string | object> = {
    method: params.metadata.method,
  };

  if (Object.keys(headersObj).length > 0) {
    fetchOptions.headers = headersObj;
  }

  if (Object.keys(bodyObj).length > 0) {
    fetchOptions.body = bodyObj;
  }

  return `fetch('${url}', ${JSON.stringify(fetchOptions, null, 2)})`;
}
