// @ts-check
import { Application } from "typedoc";

const jsonOut = "typedoc/documentation.json";

const app = await Application.bootstrapWithPlugins({
  entryPoints: [
    "src/exports/**/*.ts",
    "src/extensions/modules/**/index.ts",
    "src/adapters/eip1193/index.ts",
    "src/wallets/smart/presets/index.ts",
    "src/ai/index.ts",
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
