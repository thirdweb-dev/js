import TypeDoc from "typedoc";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";

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
    const docsFolder = path.resolve(process.cwd(), "typedoc/docs");

    if (existsSync(docsFolder)) {
      await fs.rm(docsFolder, {
        recursive: true,
      });
    }

    await app.generateDocs(project, "typedoc/docs");
  }

  if (options.output === "json" || options.output === "both") {
    await app.generateJson(project, outFile);
  }
}
