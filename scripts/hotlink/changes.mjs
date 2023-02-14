export const changes = [
  // react
  {
    path: "/packages/react/package.json",
    entry: "./src/index.ts",
    exports: {
      ".": "./src/index.ts",
      "./evm": "./src/evm/index.ts",
      "./solana": "./src/solana/index.ts",
      "./evm/connectors/magic": "./src/evm/connectors/magic.ts",
      "./evm/connectors/gnosis-safe": "./src/evm/connectors/gnosis-safe.ts",
    },
  },
  // react-core
  {
    path: "/packages/react-core/package.json",
    entry: "./src/index.ts",
    exports: {
      ".": "./src/index.ts",
      "./evm": "./src/evm/index.ts",
      "./solana": "./src/solana/index.ts",
    },
  },
  // sdk
  // {
  //   path: "/packages/sdk/package.json",
  //   entry: "./src/index.ts",
  //   exports: {
  //     ".": "./src/index.ts",
  //     "./evm": "./src/evm/index.ts",
  //     "./solana": "./src/solana/index.ts",
  //     "./solana/server": "./src/solana/server/index.ts",
  //   },
  // },
];
