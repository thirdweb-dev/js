// @ts-check
import { typedoc } from "typedoc-gen";

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
