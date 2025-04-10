import type {
  BlueprintListItem,
  MinimalBlueprintSpec,
} from "../src/app/insight/utils";

async function fetchBlueprintList() {
  const res = await fetch("https://insight.thirdweb.com/v1/blueprints");

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch blueprints: ${text}`);
  }

  const json = (await res.json()) as { data: BlueprintListItem[] };

  return json.data;
}

export const fetchAllBlueprints = async (): Promise<MinimalBlueprintSpec[]> => {
  try {
    const blueprints = await fetchBlueprintList();

    return blueprints.map((blueprint) => {
      return {
        id: blueprint.id,
        name: blueprint.name,
        paths: blueprint.paths.map(({ method, ...path }) => path),
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};
