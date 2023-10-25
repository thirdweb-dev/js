import TypeDoc, { JSONOutput } from "typedoc";
import { writeFile, readFile } from "node:fs/promises";
import { transform } from "typedoc-better-json";

/**
 *
 * Generate a documentation JSON file for a project
 */
export async function typedoc(options: {
  entryPoints: string[];
  exclude: string[];
  output: "json" | "html" | "both";
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

  if (options.output === "html" || options.output === "both") {
    await app.generateDocs(project, "typedoc/docs");
  }

  if (options.output === "json" || options.output === "both") {
    // -full file is the typedoc official output, we further process it to make it easy to generate docs
    await app.generateJson(project, outFile.replace(".json", "-full.json"));
    const fileContent = await readFile(
      outFile.replace(".json", "-full.json"),
      "utf8",
    );

    const fileData = JSON.parse(fileContent) as JSONOutput.ProjectReflection;
    await writeFile(outFile, JSON.stringify(transform(fileData), null, 2));
  }
}
