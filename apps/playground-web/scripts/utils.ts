import {
  type BlueprintListItem,
  type MinimalBlueprintSpec,
  fetchBlueprintSpec,
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
    // fetch list
    const blueprintSpecs = await fetchBlueprintList();

    // fetch all blueprints
    const blueprints = await Promise.all(
      blueprintSpecs.map((spec) =>
        fetchBlueprintSpec({
          blueprintId: spec.id,
        }),
      ),
    );

    return blueprints.map((blueprint) => {
      const paths = Object.keys(blueprint.openapiJson.paths);
      return {
        id: blueprint.id,
        name: blueprint.name,
        paths: paths.map((pathName) => {
          const pathObj = blueprint.openapiJson.paths[pathName];
          if (!pathObj) {
            throw new Error(`Path not found: ${pathName}`);
          }

          return {
            name: pathObj.get?.summary || "Unknown",
            path: pathName,
          };
        }),
      } satisfies MinimalBlueprintSpec;
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};
