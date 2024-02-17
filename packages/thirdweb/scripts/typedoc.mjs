/* eslint-disable better-tree-shaking/no-top-level-side-effects */

// @ts-check
import { typedoc } from "typedoc-gen";

typedoc({
  entryPoints: [
    "src/index.ts",
    "src/react/index.ts",
    "src/rpc/index.ts",
    "src/transaction/index.ts",
    "src/event/index.ts",
    "src/storage/index.ts",
    "src/wallets/index.ts",
    "src/utils/index.ts",
    "src/contract/index.ts",
    "src/wallets/{smart,injected,wallet-connect}/index.ts",
    "src/extensions/*.ts",
    "src/adapters/*.ts",
  ],
  exclude: ["test/**/*", "src/**/*.test.ts", "src/**/*.bench.ts"],
});
