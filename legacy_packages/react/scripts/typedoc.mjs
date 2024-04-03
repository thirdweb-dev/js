/* eslint-disable better-tree-shaking/no-top-level-side-effects */

// @ts-check
import { typedoc } from "typedoc-gen";

typedoc({
  entryPoints: ["src/index.ts"],
  exclude: [
    "**/legacy_packages/sdk/**",
    "**/legacy_packages/wallets/**",
    "**/legacy_packages/react-core/**",
    "**/legacy_packages/chains/**",
  ],
});
