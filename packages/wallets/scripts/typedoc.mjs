// @ts-check
/* eslint-disable better-tree-shaking/no-top-level-side-effects */

import { typedoc } from "typedoc-gen";

typedoc({
  entryPoints: [
    "src/index.ts",
    "src/evm/wallets/aws-kms.ts",
    "src/evm/wallets/gcp-kms.ts",
    "src/evm/wallets/private-key.ts",
    "src/evm/wallets/aws-secrets-manager.ts",
  ],
  exclude: [],
  output: "both", // TODO: change this to 'json' when old portal is fully migrated to new portal
});
