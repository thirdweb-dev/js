/* eslint-disable better-tree-shaking/no-top-level-side-effects */

import { typedoc } from "@thirdweb-dev/typedoc";

typedoc({
  entryPoints: ["src/index.ts"],
  exclude: [
    "**/packages/sdk/**",
    "**/packages/wallets/**",
    "**/packages/chains/**",
  ],
  outFile: "typedoc/documentation.json",
});
