import Markdown from "react-markdown";
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
      description: React.ReactNode;
      type?: string;
      example?:
        | string
        | boolean
        | number
        | object
        | Array<string | boolean | number | object>;
    }
  | {
      name: string;
      required: true;
      example:
        | string
        | boolean
        | number
        | object
        | Array<string | boolean | number | object>;
      description: React.ReactNode;
      type?: string;
    };

export type ApiEndpointMeta = {
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

export function ApiEndpoint(props: { metadata: ApiEndpointMeta }) {
  const { responseExamples, request } = props.metadata;

  const requestExamples: Array<{
    lang: "javascript" | "bash";
    code: string;
    label: string;
  }> = [
    {
      code: createFetchCommand({
        metadata: props.metadata,
      }),
      label: "Fetch",
      lang: "javascript",
    },
    {
      code: createCurlCommand({
        metadata: props.metadata,
      }),
      label: "Curl",
      lang: "bash",
    },
  ];

  const responseKeys = Object.keys(responseExamples);

  return (
    <div>
      <div className="flex flex-col gap-3">
        <Heading anchorId="title" className="mb-0" level={2}>
          {props.metadata.title}
        </Heading>
        <Markdown>{props.metadata.description as string}</Markdown>
      </div>

      <div>
        <Heading anchorId="request" className="text-lg lg:text-lg" level={2}>
          Request
        </Heading>
        <div className="rounded-lg border">
          <RequestExample
            // render <CodeBlock /> on server and pass it to client
            codeExamples={requestExamples.map((example) => {
              return {
                code: (
                  <CodeBlock
                    className="rounded-none border-none"
                    code={example.code}
                    containerClassName="m-0"
                    lang={example.lang}
                  />
                ),
                label: example.label,
              };
            })}
            endpointUrl={props.metadata.path}
            method={props.metadata.method}
          />
        </div>
        {/* 
          TODO: add this back in but as a collapsible section, along with query params
        <div className="mt-4">
					{request.headers.length > 0 && (
						<ParameterSection parameters={request.headers} title="Headers" />
					)}

					{request.pathParameters.length > 0 && (
						<ParameterSection
							parameters={request.pathParameters}
							title="Path parameters"
						/>
					)}

					{request.bodyParameters.length > 0 && (
						<ParameterSection
							parameters={request.bodyParameters}
							title="Body"
						/>
					)}
				</div> */}
      </div>

      <div>
        <Heading anchorId="response" className="text-lg lg:text-lg" level={2}>
          Response
        </Heading>
        <div className="overflow-hidden rounded-lg border">
          <Tabs className="w-full" defaultValue={responseKeys[0]}>
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
              <TabsContent className="m-0" key={status} value={status}>
                <CodeBlock
                  className="rounded-none border-none"
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
    <div className="mb-5">
      <h6 className="my-2 break-words text-foreground text-sm font-semibold">
        {props.title}
      </h6>
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
      accordionTriggerClassName="font-mono"
      summary={param.name}
      tags={param.required ? ["Required"] : []}
    >
      <div className={"flex flex-col gap-2"}>
        <Paragraph>{param.description}</Paragraph>
        {param.type && (
          <div className="rounded-lg border">
            <h4 className="border-b p-3 text-sm"> Type </h4>
            <CodeBlock
              className="border-none"
              code={param.type}
              containerClassName="mb-0"
              lang="typescript"
            />
          </div>
        )}
      </div>
    </Details>
  );
}

function createCurlCommand(params: { metadata: ApiEndpointMeta }) {
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

function createFetchCommand(params: { metadata: ApiEndpointMeta }) {
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
