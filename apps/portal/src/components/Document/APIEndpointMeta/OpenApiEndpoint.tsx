import { cache, Suspense } from "react";
import {
  type APIParameter,
  ApiEndpoint,
  type ApiEndpointMeta,
} from "./ApiEndpoint";

// OpenAPI 3.0 types (simplified for our needs)
interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: {
    [path: string]: {
      [method: string]: {
        summary?: string;
        description?: string;
        parameters?: Array<{
          name: string;
          in: "query" | "header" | "path" | "cookie";
          required?: boolean;
          description?: string;
          schema?: {
            type?: string;
            example?: any;
            default?: any;
          };
          example?: any;
        }>;
        requestBody?: {
          required?: boolean;
          content: {
            [mediaType: string]: {
              schema?: {
                type?: string;
                properties?: {
                  [key: string]: {
                    type?: string;
                    description?: string;
                    example?: any;
                    required?: boolean;
                  };
                };
                required?: string[];
                example?: any;
                examples?: any[];
              };
            };
          };
        };
        responses: {
          [statusCode: string]: {
            description: string;
            content?: {
              [mediaType: string]: {
                schema?: {
                  type?: string;
                  properties?: {
                    [key: string]: {
                      type?: string;
                      description?: string;
                      example?: any;
                      required?: boolean;
                    };
                  };
                  required?: string[];
                  example?: any;
                  examples?: any[];
                };
              };
            };
          };
        };
      };
    };
  };
}

interface OpenApiEndpointProps {
  specUrl?: string;
  path: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  requestBodyOverride?: Record<string, unknown>;
  responseExampleOverride?: Record<string, string>;
}

// Cache the OpenAPI spec fetch for 1 hour
const fetchOpenApiSpec = cache(async (url: string): Promise<OpenApiSpec> => {
  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour (3600 seconds)
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI spec: ${response.statusText}`);
  }
  return response.json();
});

// Helper function to get example values based on type
function getExampleForType(type?: string): unknown {
  switch (type) {
    case "string":
      return "string";
    case "number":
    case "integer":
      return 0;
    case "boolean":
      return true;
    case "array":
      return [];
    case "object":
      return {};
    default:
      return undefined;
  }
}

// Recursively generate example values from OpenAPI schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateExampleFromSchema(schema: any, visited = new Set()): any {
  // Prevent infinite recursion with circular references
  if (visited.has(schema)) {
    return {};
  }

  if (!schema || typeof schema !== "object") {
    return null;
  }

  // If there's an explicit example, use it
  if (schema.example !== undefined) {
    return schema.example;
  }

  // If there are examples array, use the first one
  if (
    schema.examples &&
    Array.isArray(schema.examples) &&
    schema.examples.length > 0
  ) {
    return schema.examples[0];
  }

  // If there's a default value, use it
  if (schema.default !== undefined) {
    return schema.default;
  }

  visited.add(schema);

  try {
    switch (schema.type) {
      case "string":
        if (schema.enum && schema.enum.length > 0) {
          return schema.enum[0];
        }
        if (schema.format === "date-time") {
          return new Date().toISOString();
        }
        if (schema.format === "date") {
          return new Date().toISOString().split("T")[0];
        }
        if (schema.format === "email") {
          return "user@example.com";
        }
        if (schema.format === "uri" || schema.format === "url") {
          return "https://example.com";
        }
        return "string";

      case "number":
      case "integer":
        if (schema.minimum !== undefined) {
          return schema.minimum;
        }
        if (schema.maximum !== undefined) {
          return Math.min(schema.maximum, 100);
        }
        return schema.type === "integer" ? 0 : 0.0;

      case "boolean":
        return true;

      case "array":
        if (schema.items) {
          const itemExample = generateExampleFromSchema(schema.items, visited);
          return [itemExample];
        }
        return [];

      case "object": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: Record<string, any> = {};

        if (schema.properties) {
          const required = schema.required || [];

          // Always include required properties
          for (const requiredProp of required) {
            if (schema.properties[requiredProp]) {
              obj[requiredProp] = generateExampleFromSchema(
                schema.properties[requiredProp],
                visited,
              );
            }
          }

          // Include some optional properties (up to 3 additional ones)
          const optionalProps = Object.keys(schema.properties).filter(
            (prop) => !required.includes(prop),
          );
          const propsToInclude = optionalProps.slice(0, 3);

          for (const prop of propsToInclude) {
            obj[prop] = generateExampleFromSchema(
              schema.properties[prop],
              visited,
            );
          }
        }

        // If no properties defined but additionalProperties is allowed
        if (
          Object.keys(obj).length === 0 &&
          schema.additionalProperties !== false
        ) {
          obj.property = "value";
        }

        return obj;
      }

      case "null":
        return null;

      default:
        // Handle allOf, oneOf, anyOf
        if (schema.allOf && Array.isArray(schema.allOf)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const merged: Record<string, any> = {};
          for (const subSchema of schema.allOf) {
            const subExample = generateExampleFromSchema(subSchema, visited);
            if (typeof subExample === "object" && subExample !== null) {
              Object.assign(merged, subExample);
            }
          }
          return merged;
        }

        if (
          schema.oneOf &&
          Array.isArray(schema.oneOf) &&
          schema.oneOf.length > 0
        ) {
          return generateExampleFromSchema(schema.oneOf[0], visited);
        }

        if (
          schema.anyOf &&
          Array.isArray(schema.anyOf) &&
          schema.anyOf.length > 0
        ) {
          return generateExampleFromSchema(schema.anyOf[0], visited);
        }

        // If we can't determine the type, return a generic object
        return schema.properties
          ? generateExampleFromSchema(
              { type: "object", properties: schema.properties },
              visited,
            )
          : "value";
    }
  } finally {
    visited.delete(schema);
  }
}

function transformOpenApiToApiEndpointMeta(
  spec: OpenApiSpec,
  path: string,
  method: string,
  requestBodyOverride?: Record<string, unknown>,
  responseExampleOverride?: Record<string, string>,
): ApiEndpointMeta {
  const pathItem = spec.paths[path];
  if (!pathItem) {
    throw new Error(`Path ${path} not found in OpenAPI spec`);
  }

  const operation = pathItem[method.toLowerCase()];
  if (!operation) {
    throw new Error(`Method ${method} not found for path ${path}`);
  }

  // Get the base URL from servers
  const baseUrl = spec.servers?.[0]?.url || "";

  // Transform parameters
  const pathParameters: APIParameter[] = [];
  const headers: APIParameter[] = [];
  const queryParameters: APIParameter[] = [];

  if (operation.parameters) {
    for (const param of operation.parameters) {
      const apiParam: APIParameter = {
        name: param.name,
        description: param.description || "",
        type: param.schema?.type || "string",
        required: param.required || false,
        example:
          param.example ||
          param.schema?.example ||
          param.schema?.default ||
          getExampleForType(param.schema?.type),
      } as APIParameter;

      switch (param.in) {
        case "path":
          pathParameters.push(apiParam);
          break;
        case "header":
          headers.push(apiParam);
          break;
        case "query":
          queryParameters.push(apiParam);
          break;
      }
    }
  }

  // Transform request body parameters
  const bodyParameters: APIParameter[] = [];

  // Use override if provided
  if (requestBodyOverride) {
    for (const [key, value] of Object.entries(requestBodyOverride)) {
      const apiParam: APIParameter = {
        name: key,
        description: "",
        required: false,
        example: value,
      } as APIParameter;

      bodyParameters.push(apiParam);
    }
  } else if (operation.requestBody) {
    const content = operation.requestBody.content;
    const jsonContent = content["application/json"];

    if (jsonContent?.schema?.properties) {
      const required = jsonContent.schema.required || [];

      for (const [propName, propSchema] of Object.entries(
        jsonContent.schema.properties,
      )) {
        const prop = propSchema as {
          type?: string;
          description?: string;
          example?: string | number | boolean | object;
          format?: string;
          enum?: (string | number | boolean)[];
        };

        // Generate example if not provided
        let example = prop.example;
        if (example === undefined) {
          example = generateExampleFromSchema(prop);
        }

        const apiParam: APIParameter = {
          name: propName,
          description: prop.description || "",
          type: prop.type || "string",
          required: required.includes(propName),
          example: example,
        } as APIParameter;

        bodyParameters.push(apiParam);
      }
    } else {
      // Fallback: try to generate from the schema example
      const example =
        jsonContent?.schema?.example || jsonContent?.schema?.examples?.[0];

      if (example && typeof example === "object" && example !== null) {
        for (const [key, value] of Object.entries(example)) {
          const apiParam: APIParameter = {
            name: key,
            description: "",
            required: false,
            example: value,
          } as APIParameter;

          bodyParameters.push(apiParam);
        }
      }
    }
  }

  // Transform responses
  const responseExamples: Record<string, string> = {};

  // Use override if provided, otherwise generate from OpenAPI spec
  if (responseExampleOverride) {
    Object.assign(responseExamples, responseExampleOverride);
  } else {
    for (const [statusCode, response] of Object.entries(operation.responses)) {
      const content = response.content;
      let example = "";

      if (content) {
        const jsonContent = content["application/json"];
        if (jsonContent?.schema) {
          // Use the recursive function to generate examples from schema
          const generatedExample = generateExampleFromSchema(
            jsonContent.schema,
          );
          example = JSON.stringify(generatedExample, null, 2);
        } else {
          example = JSON.stringify({ message: response.description }, null, 2);
        }
      } else {
        example = JSON.stringify({ message: response.description }, null, 2);
      }

      responseExamples[statusCode] = example;
    }
  }

  return {
    title: operation.summary || `${method.toUpperCase()} ${path}`,
    description: "", // Always empty since we don't want to show titles/descriptions
    path,
    origin: baseUrl,
    method: method.toUpperCase() as "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    request: {
      pathParameters,
      headers,
      queryParameters,
      bodyParameters,
    },
    responseExamples,
  };
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-sm text-muted-foreground">
        Loading API documentation...
      </div>
    </div>
  );
}

export function OpenApiEndpoint(props: OpenApiEndpointProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OpenApiEndpointInner {...props} />
    </Suspense>
  );
}

async function OpenApiEndpointInner({
  specUrl = "https://api.thirdweb.com/openapi.json",
  path,
  method = "GET",
  requestBodyOverride,
  responseExampleOverride,
}: OpenApiEndpointProps) {
  try {
    const spec = await fetchOpenApiSpec(specUrl);
    const metadata = transformOpenApiToApiEndpointMeta(
      spec,
      path,
      method,
      requestBodyOverride,
      responseExampleOverride,
    );
    return <ApiEndpoint metadata={metadata} key={specUrl + path} />;
  } catch (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="text-sm text-red-800">
          Failed to load OpenAPI specification:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }
}
