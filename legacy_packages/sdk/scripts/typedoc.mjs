// @ts-check
/* eslint-disable better-tree-shaking/no-top-level-side-effects */

import { typedoc } from "typedoc-gen";

typedoc({
  entryPoints: ["src/index.ts"],
  exclude: ["**/packages/storage/**", "**/packages/chains/**"],
});
