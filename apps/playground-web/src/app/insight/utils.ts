// Note: This file is also used in the update-insight-blueprints script
// Do not use Next.js/Vercel specific APIs or envs here

import type { OpenAPIV3 } from "openapi-types";

export type BlueprintParameter = OpenAPIV3.ParameterObject;
export type BlueprintPathMetadata = OpenAPIV3.PathItemObject;

export type BlueprintListItem = {
  id: string;
  name: string;
  slug: string;
};

export type BlueprintSpec = {
  id: string;
  name: string;
  description: string;
  openapiJson: OpenAPIV3.Document;
};

export type MinimalBlueprintSpec = {
  id: string;
  name: string;
  paths: {
    name: string;
    path: string;
  }[];
};

export async function fetchBlueprintSpec(params: {
  blueprintId: string;
}) {
  const res = await fetch(
    `https://insight.thirdweb.com/v1/blueprints/${params.blueprintId}`,
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch blueprint: ${text}`);
  }

  const json = (await res.json()) as { data: BlueprintSpec };

  return json.data;
}
