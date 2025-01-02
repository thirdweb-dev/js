import type { NFTInput } from "thirdweb/utils";

export function parseAttributes<T extends NFTInput>(input: T): T {
  return {
    ...input,
    attributes: removeEmptyValues(input.attributes),
    properties: removeEmptyValues(input.properties),
  };
}

export function removeEmptyValues(data: NFTInput["attributes"]) {
  if (!data) {
    return data;
  }
  if (Array.isArray(data)) {
    const parsedArray = data
      .flat()
      .filter(({ value }) => value !== "")
      .map(({ value, trait_type }) => ({
        ...(!!trait_type && { trait_type }),
        value,
      }));
    return parsedArray.length === 0 ? undefined : parsedArray;
  }
  return Object.entries(data).reduce(
    (acc, [key, value]) => {
      if (value !== "") {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );
}
