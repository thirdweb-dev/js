import TypeDoc from "typedoc";

/**
 *
 * Generate a documentation JSON file for a project
 */
export async function typedoc(options: {
  entryPoints: string[];
  exclude: string[];
}) {
  const outFile = "typedoc/documentation.json";

  const app = await TypeDoc.Application.bootstrapWithPlugins({
    entryPoints: options.entryPoints,
    excludeInternal: true,
    exclude: options.exclude,
  });

  const project = await app.convert();
  if (!project) {
    throw new Error("Failed to create project");
  }

  await app.generateJson(project, outFile);
}
