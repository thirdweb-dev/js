const jsdocRuleOverrides = {
  "jsdoc/require-jsdoc": [
    "error",
    {
      require: {
        // class
        ClassDeclaration: true,
        ClassExpression: true,
        MethodDefinition: true,
        // methods
      },
      contexts: [
        // const foo = () => {}
        "Program > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression",
        // export const foo = () => {}
        "Program > ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression",
      ],
      publicOnly: true,
    },
  ],
  "jsdoc/check-indentation": "error",
  "jsdoc/require-asterisk-prefix": "error",
  "jsdoc/require-description": "error",
  "jsdoc/require-example": "error",
  "jsdoc/check-tag-names": [
    "error",
    {
      definedTags: [
        "contract",
        "wallet",
        "extension",
        "rpc",
        "transaction",
        "walletConfig",
        "connectWallet",
        "theme",
        "locale",
        "component",
        "walletUtils",
      ],
    },
  ],
  "jsdoc/require-returns": [
    "error",
    {
      exemptedBy: ["component"],
    },
  ],
};

module.exports = {
  root: true,
  extends: [
    "thirdweb",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    "plugin:jsdoc/recommended-typescript-error",
  ],
  plugins: ["better-tree-shaking", "jsdoc", "svg-jsx"],
  settings: {
    jsdoc: {
      ignoreInternal: true,
    },
  },
  rules: {
    "svg-jsx/camel-case-dash": "error",
    "better-tree-shaking/no-top-level-side-effects": "error",
    "no-restricted-globals": [
      "error",
      {
        name: "Buffer",
        message: "Use Uint8Array instead.",
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "buffer/",
            message: "Use Uint8Array instead.",
          },
          {
            name: "buffer",
            message: "Use Uint8Array instead.",
          },
          {
            name: "node:buffer",
            message: "Use Uint8Array instead.",
          },
          {
            name: "viem",
            importNames: [
              "isHex",
              "hexToString",
              "hexToBigInt",
              "hexToNumber",
              "hexToBool",
              "fromHex",
              "hexToBytes",
              "hexFromBytes",
              "bytesToHex",
              "boolToHex",
              "numberToHex",
              "stringToHex",
              "bytesToHex",
              "toHex",
              "padHex",
              "formatUnits",
              "parseUnits",
              "formatEther",
              "parseEther",
              "formatGwei",
              "parseGwei",
              "keccak256",
              "toBytes",
              "boolToBytes",
              "hexToBytes",
              "numberToBytes",
              "stringToBytes",
              "bytesToString",
              "bytesToNumber",
              "bytesToBigInt",
              "bytesToBool",
              "fromBytes",
              "isAddress",
              "getAddress",
              "checksumAddress",
            ],
            message: "Use thirdweb/utils instead.",
          },
        ],
        patterns: [
          {
            group: ["**/exports/*"],
            message:
              "Importing from the 'exports' folder is disallowed, instead import directly from the src folder.",
          },
        ],
      },
    ],

    ...jsdocRuleOverrides,
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-import-type-side-effects": "error",
  },
  overrides: [
    {
      files: ["*.bench.ts", "*.test.ts", "test/**/*"],
      rules: {
        "better-tree-shaking/no-top-level-side-effects": "off",
        "jsdoc/require-jsdoc": "off",
      },
    },
  ],
};
