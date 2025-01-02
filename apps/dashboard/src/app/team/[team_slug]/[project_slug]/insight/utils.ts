import "server-only";

import type { OpenAPIV3 } from "openapi-types";
import { getVercelEnv } from "../../../../../lib/vercel-utils";

type BlueprintListItem = {
  id: string;
  name: string;
  description: string;
  slug: string;
};

const thirdwebDomain =
  getVercelEnv() !== "production" ? "thirdweb-dev" : "thirdweb";

async function fetchBlueprintList(props: {
  authToken: string;
}) {
  const res = await fetch(
    `https://insight.${thirdwebDomain}.com/v1/blueprints`,
    {
      headers: {
        Authorization: `Bearer ${props.authToken}`,
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch blueprints: ${text}`);
  }

  const json = (await res.json()) as { data: BlueprintListItem[] };

  return json.data;
}

export type BlueprintParameter = OpenAPIV3.ParameterObject;
export type BlueprintPathMetadata = OpenAPIV3.PathItemObject;

type BlueprintSpec = {
  id: string;
  name: string;
  description: string;
  openapiJson: OpenAPIV3.Document;
};

export async function fetchBlueprintSpec(params: {
  blueprintId: string;
  authToken: string;
}) {
  const res = await fetch(
    `https://insight.${thirdwebDomain}.com/v1/blueprints/${params.blueprintId}`,
    {
      headers: {
        Authorization: `Bearer ${params.authToken}`,
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch blueprint: ${text}`);
  }

  const json = (await res.json()) as { data: BlueprintSpec };

  return json.data;
}

export async function fetchAllBlueprints(params: {
  authToken: string;
}) {
  // fetch list
  const blueprintSpecs = await fetchBlueprintList(params);

  // fetch all blueprints
  const blueprints = await Promise.all(
    blueprintSpecs.map((spec) =>
      fetchBlueprintSpec({
        blueprintId: spec.id,
        authToken: params.authToken,
      }),
    ),
  );

  return blueprints;
}
