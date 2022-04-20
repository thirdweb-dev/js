import { EditionMutationInput } from "@3rdweb-sdk/react";
import type { Json, NFTMetadataInput } from "@thirdweb-dev/sdk";

export function parseAttributes<
  T extends NFTMetadataInput | EditionMutationInput,
>(input: T): T {
  return {
    ...input,
    attributes: removeEmptyValues(input.attributes),
    properties: removeEmptyValues(input.properties),
  };
}

function removeEmptyValues(data: NFTMetadataInput["attributes"]) {
  if (!data) {
    return data;
  }
  if (Array.isArray(data)) {
    const parsedArray = data
      .filter(({ value }) => value !== "")
      .map(({ value, trait_type }) => ({
        value,
        ...(!!trait_type && { trait_type }),
      }));
    return parsedArray.length === 0 ? undefined : parsedArray;
  }
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, Json>);
}
