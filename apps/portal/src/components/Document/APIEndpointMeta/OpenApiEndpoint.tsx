import { Spinner } from "@workspace/ui/components/spinner";
import type { OpenAPIV3_1 } from "openapi-types";
import { cache, Suspense } from "react";
import {
  type APIParameter,
  ApiEndpoint,
  type ApiEndpointMeta,
} from "./ApiEndpoint";

// OpenAPI 3.0 types (simplified for our needs)
type OpenApiSpec = OpenAPIV3_1.Document;

interface OpenApiEndpointProps {
  specUrl?: string;
  path: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  requestBodyOverride?: Record<string, any>;
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

// Recursively generate example values from OpenAPI schema
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
          // Join all enum values with | separator for display
          return schema.enum.join(" | ");
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
        if (schema.enum && schema.enum.length > 0) {
          // Join all enum values with | separator for display
          return schema.enum.join(" | ");
        }
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
  requestBodyOverride?: Record<string, any>,
  responseExampleOverride?: Record<string, string>,
): ApiEndpointMeta {
  const pathItem = spec.paths?.[path];
  if (!pathItem) {
    throw new Error(`Path ${path} not found in OpenAPI spec`);
  }

  const operation = pathItem[
    method.toLowerCase() as keyof typeof pathItem
  ] as OpenAPIV3_1.OperationObject;
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
    for (const param of operation.parameters as OpenAPIV3_1.ParameterObject[]) {
      const schema = param.schema as OpenAPIV3_1.SchemaObject;
      const apiParam: APIParameter = {
        name: param.name,
        description: param.description || "",
        type: schema?.type || "string",
        required: param.required || false,
        example: param.example || schema?.example || schema?.default,
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

  // push default headers hardcoded for now
  headers.push({
    name: "x-secret-key",
    type: "backend",
    description:
      "Project secret key - for backend usage only. Should not be used in frontend code.",
    required: false,
    example: undefined,
  });
  headers.push({
    name: "x-client-id",
    type: "frontend",
    description:
      "Project client ID - for frontend usage on authorized domains.",
    required: false,
    example: undefined,
  });
  headers.push({
    name: "x-ecosystem-id",
    type: "optional",
    description: "Ecosystem ID - for ecosystem wallets.",
    required: false,
    example: undefined,
  });
  headers.push({
    name: "x-ecosystem-partner-id",
    type: "optional",
    description: "Ecosystem partner ID - for ecosystem wallets.",
    required: false,
    example: undefined,
  });

  if (
    method === "POST" &&
    !path.includes("/v1/contracts/read") &&
    !path.includes("/v1/auth")
  ) {
    headers.push({
      name: "Authorization",
      type: "frontend",
      description: "Bearer token (JWT) for user wallet authentication",
      required: false,
      example: undefined,
    });
  }

  // Transform request body parameters
  const bodyParameters: APIParameter[] = [];
  const requestExamples: Array<{
    title: string;
    bodyParameters: APIParameter[];
  }> = [];

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
    const content = (operation.requestBody as OpenAPIV3_1.RequestBodyObject)
      .content;
    const jsonContent = content["application/json"];
    const schema = jsonContent?.schema as OpenAPIV3_1.SchemaObject;

    // Check if this is a oneOf schema (multiple possible request bodies)
    if (schema?.oneOf && Array.isArray(schema.oneOf)) {
      // Parse each oneOf schema into separate request examples
      for (const [index, oneOfSchema] of schema.oneOf.entries()) {
        const schema = oneOfSchema as any;
        const title = schema.title || `Option ${index + 1}`;
        const required = schema.required || [];
        const schemaBodyParameters: APIParameter[] = [];

        // Use schema examples if available
        const schemaExamples = schema.examples || [];
        const schemaExample = schemaExamples[index];

        if (schemaExample && typeof schemaExample === "object") {
          // Use the provided example
          for (const [key, value] of Object.entries(schemaExample)) {
            const property = schema.properties?.[key];
            const apiParam: APIParameter = {
              name: key,
              description: property?.description || "",
              type: property?.type,
              required: required.includes(key),
              example: value as any,
            };
            schemaBodyParameters.push(apiParam);
          }
        } else if (schema.properties) {
          // Generate from schema properties
          for (const [propName, propSchema] of Object.entries(
            schema.properties,
          )) {
            const prop = propSchema as any;
            const apiParam: APIParameter = {
              name: propName,
              description: prop.description || "",
              type: prop.type,
              required: required.includes(propName),
              example: generateExampleFromSchema(prop) as any,
            };
            schemaBodyParameters.push(apiParam);
          }
        }

        requestExamples.push({
          title,
          bodyParameters: schemaBodyParameters,
        });
      }
    } else {
      // Single schema (not oneOf)
      const example = schema?.example || schema?.examples?.[0];
      const required = schema?.required || [];

      if (example) {
        // If there's a global example use that
        if (typeof example === "object" && example !== null) {
          for (const [key, value] of Object.entries(example)) {
            const apiParam: APIParameter = {
              name: key,
              description: schema?.properties?.[key]?.description || "",
              required: required.includes(key),
              example: value,
            } as APIParameter;

            bodyParameters.push(apiParam);
          }
        }
      } else if (schema?.properties) {
        for (const [propName, propSchema] of Object.entries(
          schema.properties,
        )) {
          const prop = propSchema as any;
          const apiParam: APIParameter = {
            name: propName,
            description: prop.description || "",
            type: prop.type,
            required: required.includes(propName),
            example: prop.example || generateExampleFromSchema(prop),
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
    responseExamples["200"] = JSON.stringify(responseExampleOverride, null, 2);
  } else {
    for (const [statusCode, response] of Object.entries(
      (operation as OpenAPIV3_1.OperationObject).responses || {},
    )) {
      const content = (response as OpenAPIV3_1.ResponseObject).content;
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

  const tag = operation.tags?.[0] || "";

  return {
    title: operation.summary || `${method.toUpperCase()} ${path}`,
    description: operation.description || operation.summary || "",
    path,
    origin: baseUrl,
    method: method.toUpperCase() as "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    referenceUrl: generateReferenceUrl(tag, path, method),
    request: {
      pathParameters,
      headers,
      queryParameters,
      bodyParameters,
      // Include request examples if we have oneOf schemas
      requestExamples: requestExamples.length > 0 ? requestExamples : undefined,
    },
    responseExamples,
  };
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8 border rounded-lg min-h-[300px] bg-card">
      <Spinner className="size-8 text-muted-foreground" />
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
    return <ApiEndpoint metadata={metadata} key={specUrl + path + method} />;
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

function generateReferenceUrl(
  tag: string,
  path: string,
  method: string,
): string {
  return `/reference#tag/${tag.toLowerCase()}/${method.toLowerCase()}${path}`;
}
