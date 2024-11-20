// @ts-check
import TypeDoc from "typedoc";

const jsonOut = "typedoc/documentation.json";

const app = await TypeDoc.Application.bootstrapWithPlugins({
  entryPoints: [
    "src/exports/**/*.ts",
    "src/extensions/modules/**/index.ts",
    "src/react/web/ui/prebuilt/NFT/index.ts",
  ],
  exclude: [
    "src/exports/*.native.ts",
    "src/exports/**/*.native.ts",
    "test/**/*",
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/**/*.bench.ts",
  ],
  excludeInternal: true,
  tsconfig: "tsconfig.typedoc.json",
});

const project = await app.convert();
if (!project) {
  throw new Error("Failed to create project");
}

await app.generateJson(project, jsonOut);
