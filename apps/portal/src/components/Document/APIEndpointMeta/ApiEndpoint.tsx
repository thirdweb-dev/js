import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "../../../lib/utils";
import { CodeBlock } from "../Code";
import { Details } from "../Details";
import { Heading } from "../Heading";
import { Paragraph } from "../Paragraph";
import { RequestExample } from "./RequestExample";

export type APIParameter =
  | {
      name: string;
      required: false;
      description: string;
      type?: string;
      example?: string | boolean | number | object;
    }
  | {
      name: string;
      required: true;
      example: string;
      description: string;
      type?: string;
    };

type ApiEndpointMeta = {
  title: string;
  description: React.ReactNode;
  path: string;
  origin: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  request: {
    pathParameters: APIParameter[];
    headers: APIParameter[];
    bodyParameters: APIParameter[];
  };
  responseExamples: Record<string, string>;
};

export function ApiEndpoint(props: {
  metadata: ApiEndpointMeta;
}) {
  const { request, responseExamples } = props.metadata;

  const requestExamples: Array<{
    lang: "javascript" | "bash";
    code: string;
    label: string;
  }> = [
    {
      code: createFetchCommand({
        metadata: props.metadata,
      }),
      lang: "javascript",
      label: "Fetch",
    },
    {
      code: createCurlCommand({
        metadata: props.metadata,
      }),
      lang: "bash",
      label: "Curl",
    },
  ];

  const responseKeys = Object.keys(responseExamples);

  return (
    <div>
      <div>
        <div className="mb-5 flex flex-col gap-3 border-b pb-5">
          <Heading level={1} id="title" className="mb-0">
            {props.metadata.title}
          </Heading>
          <Paragraph className="mb-0">{props.metadata.description}</Paragraph>
        </div>

        {/* Headers */}
        {request.headers.length > 0 && (
          <ParameterSection title="Headers" parameters={request.headers} />
        )}

        {/* Path parameters */}
        {request.pathParameters.length > 0 && (
          <ParameterSection
            title="Path parameters"
            parameters={request.pathParameters}
          />
        )}

        {/* Body  */}
        {request.bodyParameters.length > 0 && (
          <ParameterSection title="Body" parameters={request.bodyParameters} />
        )}
      </div>

      <div>
        <Heading id="request" level={2} className="text-lg lg:text-lg">
          Request
        </Heading>
        <div className="rounded-lg border">
          <RequestExample
            // render <CodeBlock /> on server and pass it to client
            codeExamples={requestExamples.map((example) => {
              return {
                label: example.label,
                code: (
                  <CodeBlock
                    code={example.code}
                    lang={example.lang}
                    className="rounded-none border-none"
                    containerClassName="m-0"
                  />
                ),
              };
            })}
            method={props.metadata.method}
            endpointUrl={props.metadata.path}
          />
        </div>
      </div>

      <div>
        <Heading id="response" level={2} className="text-lg lg:text-lg">
          Response
        </Heading>
        <div className="overflow-hidden rounded-lg border">
          <Tabs defaultValue={responseKeys[0]} className="w-full">
            <TabsList className="w-full">
              {responseKeys.map((status) => (
                <TabsTrigger key={status} value={status}>
                  <div className="flex items-center gap-2 py-1">
                    <span
                      className={cn("h-2 w-2 rounded-full", {
                        "bg-green-500": status.startsWith("2"),
                        "bg-red-500": status.startsWith("4"),
                        "bg-yellow-500": status.startsWith("5"),
                      })}
                    />
                    <span className="text-sm">{status}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {responseKeys.map((status) => (
              <TabsContent key={status} value={status} className="m-0">
                <CodeBlock
                  code={responseExamples[status] as string}
                  lang="json"
                  containerClassName="m-0"
                  className="rounded-none border-none"
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
    <div className="mb-5">
      <Heading
        level={2}
        id={props.title}
        className="text-lg md:text-lg"
        anchorClassName="m-0 mb-2"
      >
        {props.title}
      </Heading>
      <div className="flex flex-col">
        {props.parameters
          .sort((a, b) => {
            if (a.required === b.required) {
              return 0;
            }
            return a.required ? -1 : 1;
          })
          .map((param) => (
            <ParameterItem key={param.name} param={param} />
          ))}
      </div>
    </div>
  );
}

function ParameterItem({ param }: { param: APIParameter }) {
  return (
    <Details
      accordionItemClassName="my-1"
      summary={param.name}
      tags={param.required ? ["Required"] : []}
      accordionTriggerClassName="font-mono"
    >
      <div className={"flex flex-col gap-2"}>
        <Paragraph>{param.description}</Paragraph>
        {param.type && (
          <div className="rounded-lg border">
            <h4 className="border-b p-3 text-sm"> Type </h4>
            <CodeBlock
              code={param.type}
              lang="typescript"
              containerClassName="mb-0"
              className="border-none"
            />
          </div>
        )}
      </div>
    </Details>
  );
}

function createCurlCommand(params: {
  metadata: ApiEndpointMeta;
}) {
  const url = `${params.metadata.origin}${params.metadata.path}`;
  const bodyObj: Record<string, string | number | boolean | object> = {};

  const headers = params.metadata.request.headers
    .filter((h) => h.example !== undefined)
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

function createFetchCommand(params: {
  metadata: ApiEndpointMeta;
}) {
  const headersObj: Record<string, string | number | boolean | object> = {};
  const bodyObj: Record<string, string | number | boolean | object> = {};
  const { request } = params.metadata;
  const url = `${params.metadata.origin}${params.metadata.path}`;

  for (const param of request.headers) {
    if (param.example !== undefined) {
      headersObj[param.name] = param.example;
    }
  }

  for (const param of request.bodyParameters) {
    if (param.example !== undefined) {
      bodyObj[param.name] = param.example;
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
