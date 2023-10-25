import TypeDoc, { JSONOutput } from "typedoc";
import { writeFile, readFile } from "node:fs/promises";
import { postprocess } from "./postprocess/postprocess";

/**
 *
 * Generate a documentation JSON file for a project
 */
export async function typedoc(options: {
  entryPoints: string[];
  exclude: string[];
  outFile: string;
}) {
  const { outFile } = options;

  const app = await TypeDoc.Application.bootstrapWithPlugins({
    entryPoints: options.entryPoints,
    excludeInternal: true,
    exclude: options.exclude,
  });

  const project = await app.convert();
  if (!project) {
    throw new Error("Failed to create project");
  }

  await app.generateDocs(project, "typedoc/docs");
  await app.generateJson(project, outFile.replace(".json", "-full.json"));

  const fileContent = await readFile(
    outFile.replace(".json", "-full.json"),
    "utf8",
  );

  const fileData = JSON.parse(fileContent) as JSONOutput.ProjectReflection;
  await writeFile(outFile, JSON.stringify(postprocess(fileData), null, 2));
}
