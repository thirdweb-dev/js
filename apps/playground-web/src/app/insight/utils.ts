// Note: This file is also used in the update-insight-blueprints script
// Do not use Next.js/Vercel specific APIs or envs here

import type { OpenAPIV3 } from "openapi-types";

export type BlueprintParameter = OpenAPIV3.ParameterObject;
export type BlueprintPathMetadata = OpenAPIV3.PathItemObject;

const THIRDWEB_INSIGHT_API_DOMAIN =
  process.env.NEXT_PUBLIC_INSIGHT_URL || "insight.thirdweb.com";

export type BlueprintListItem = {
  id: string;
  name: string;
  description: string;
  slug: string;
  openapiJson: OpenAPIV3.Document;
  openapiUrl: string;
  paths: {
    name: string;
    path: string;
    method: string;
    deprecated: boolean;
  }[];
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
    deprecated: boolean;
  }[];
};

export async function fetchBlueprintSpec(params: {
  blueprintId: string;
}) {
  const res = await fetch(
    `https://${THIRDWEB_INSIGHT_API_DOMAIN}/v1/blueprints/${params.blueprintId}`,
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch blueprint: ${text}`);
  }

  const json = (await res.json()) as { data: BlueprintSpec };

  return json.data;
}
