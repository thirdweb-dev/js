/* eslint-disable better-tree-shaking/no-top-level-side-effects */

// @ts-check
import { typedoc } from "typedoc-gen";

typedoc({
  entryPoints: ["src/exports/**/*.ts"],
  exclude: ["test/**/*", "src/**/*.test.ts", "src/**/*.bench.ts"],
});
