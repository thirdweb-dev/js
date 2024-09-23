// @ts-check
import TypeDoc from "typedoc";

/**
 *
 * Generate a documentation JSON file for a project
 * @param {{ entryPoints: string[]; exclude: string[]; }} options
 */
async function typedoc(options) {
  const jsonOut = "typedoc/documentation.json";

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
}

typedoc({
  entryPoints: ["src/exports/**/*.ts", "src/extensions/modules/**/index.ts"],
  exclude: [
    "src/exports/*.native.ts",
    "src/exports/**/*.native.ts",
    "test/**/*",
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/**/*.bench.ts",
  ],
});
