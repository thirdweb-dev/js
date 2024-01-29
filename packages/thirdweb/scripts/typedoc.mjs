/* eslint-disable better-tree-shaking/no-top-level-side-effects */

// @ts-check
import { typedoc } from "typedoc-gen";

typedoc({
  entryPoints: [
    "src/index.ts",
    "src/react/index.tsx",
    "src/adapters/ethers5.ts",
    "src/adapters/ethers6.ts",
    "src/event/index.ts",
    "src/extensions/erc20.ts",
    "src/extensions/erc721.ts",
    "src/rpc/index.ts",
    "src/storage/index.ts",
    "src/transaction/index.ts",
    "src/wallets/index.ts",
  ],
  exclude: [],
});
