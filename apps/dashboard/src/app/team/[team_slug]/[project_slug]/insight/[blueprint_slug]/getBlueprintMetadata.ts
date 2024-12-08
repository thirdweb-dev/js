import { getVercelEnv } from "../../../../../../lib/vercel-utils";

export type ThirdwebBlueprintSlug = "transactions" | "events" | "erc20-tokens";

export function isThirdwebBlueprintSlug(
  blueprint_slug: string,
): blueprint_slug is ThirdwebBlueprintSlug {
  return (
    blueprint_slug === "transactions" ||
    blueprint_slug === "events" ||
    blueprint_slug === "erc20-tokens"
  );
}

// TODO - for insight team:
// we need a single endpoint that gives us everything we need for the blueprints using a blueprint "id" / "slug"
// right now we have to look into two different endpoints and have to hardcode the correct "path" for the blueprints in here because the path in the schema is not correct
// these two endpoints are even using different types of schemas - one is swagger 2.0 and the other is openapi 3.0

// also - these two points are kinda flaky - _sometimes_ fetching it just fails :/
const blueprintSchemaEndpoint1 =
  "https://insight-api-t20v.zeet-nftlabs.zeet.app/openapi.json";

const blueprintSchemaEndpoint2 = "https://insight.thirdweb.com/openapi.json";

const bluePrintSlugToMetadata: Record<
  ThirdwebBlueprintSlug,
  {
    schemaEndpoint: string;
    id: string;
    title: string;
    description: string;
    // we specify it here instead of fetching this from schema endpoint because path in there is not correct and we can't use it
    path: string;
  }
> = {
  transactions: {
    schemaEndpoint: blueprintSchemaEndpoint1,
    id: "/{chainId}/transactions",
    title: "Transactions",
    description: "Retrieve all transactions across all contracts",
    path: "/v1/{clientId}/transactions",
  },
  events: {
    schemaEndpoint: blueprintSchemaEndpoint1,
    id: "/{chainId}/events",
    title: "Events",
    description: "Retrieve all logs across all contracts",
    path: "/v1/{clientId}/events",
  },
  "erc20-tokens": {
    schemaEndpoint: blueprintSchemaEndpoint2,
    id: "/v1/{clientId}/tokens/erc20/:ownerAddress",
    title: "Tokens",
    description: "Retrieve tokens balances for a given owner address",
    path: "/v1/{clientId}/tokens/erc20/:ownerAddress",
  },
};

// after looking at both endpoint1 and endpoint2, these properties are common in both and ones that we are about
type APIParameterResponse = {
  name: string;
  in: "path" | "query";
  required?: boolean;
  description?: string;
  type?: string; // swagger 2.0
  // openapi 3.0
  schema?: {
    type: string;
  };
};

type BlueprintParameter = {
  name: string;
  in: "path" | "query";
  required?: boolean;
  description?: string;
  type?: string;
};

export type BlueprintMetadata = {
  domain: string;
  parameters: BlueprintParameter[];
  title: string;
  description: string;
  path: string;
};

export async function getBlueprintMeta(
  blueprint_slug: ThirdwebBlueprintSlug,
): Promise<BlueprintMetadata> {
  const {
    schemaEndpoint: apiSchemaEndpoint,
    id,
    title,
    description,
    path,
  } = bluePrintSlugToMetadata[blueprint_slug];

  const res = await fetch(apiSchemaEndpoint);
  const data = await res.json();

  const parametersResponse = data.paths[id].get
    .parameters as APIParameterResponse[];

  const parameters: BlueprintParameter[] = parametersResponse.map((p) => {
    return {
      name: p.name,
      in: p.in,
      required: p.required,
      description: p.description,
      type: p.type || p.schema?.type,
    };
  });

  return {
    domain:
      getVercelEnv() !== "production"
        ? "https://{chainId}.insight.thirdweb-dev.com"
        : "https://{chainId}.insight.thirdweb.com",
    path,
    parameters,
    title,
    description,
  };
}
