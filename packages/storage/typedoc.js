// eslint-disable-next-line @typescript-eslint/no-var-requires
const TypeDoc = require("typedoc");

async function main() {
  // Application.bootstrap also exists, which will not load plugins
  // Also accepts an array of option readers if you want to disable
  // TypeDoc's tsconfig.json/package.json/typedoc.json option readers
  const app = await TypeDoc.Application.bootstrapWithPlugins({
    entryPoints: ["src/index.ts"],
    excludeInternal: true,
    externalPattern: ["**/node_modules/**"],
    exclude: ["**/node_modules/**"],
  });

  const project = await app.convert();

  if (project) {
    // Project may not have converted correctly
    const outputDir = "typedoc/";

    // Rendered docs
    await app.generateDocs(project, outputDir);
    // Alternatively generate JSON output
    await app.generateJson(project, outputDir + "/documentation.json");
  }
}

main();
