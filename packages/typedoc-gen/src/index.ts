import TypeDoc from "typedoc";
import { gzip } from "node:zlib";
import { readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";

/**
 *
 * Generate a documentation JSON file for a project
 */
export async function typedoc(options: {
  entryPoints: string[];
  exclude: string[];
}) {
  const jsonOut = "typedoc/documentation.json";
  const gzipOut = "typedoc/documentation.json.gz";

  const app = await TypeDoc.Application.bootstrapWithPlugins({
    entryPoints: options.entryPoints,
    excludeInternal: true,
    exclude: options.exclude,
  });

  const project = await app.convert();
  if (!project) {
    throw new Error("Failed to create project");
  }

  await app.generateJson(project, jsonOut);
  // then gzip the output
  const json = await readFile(jsonOut);
  const gzipped = await promisify(gzip)(json);
  await writeFile(gzipOut, gzipped);
  // TODO: enable this when /docs has switched over to the new format
  // delete the original json file
  // await unlink(jsonOut);
}
