module.exports = {
  root: true,
  extends: ["thirdweb"],
  plugins: ["better-tree-shaking", "eslint-plugin-tsdoc"],
  rules: {
    "better-tree-shaking/no-top-level-side-effects": "error",
    "tsdoc/syntax": "warn",
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "ethers",
            importNames: ["ethers"],
            message:
              "Do not import entire ethers object, Use named imports instead.",
          },
          {
            name: "eventemitter3",
            importNames: ["EventEmitter"],
            message:
              "Do not use named import for importing EventEmitter, Use default import instead.",
          },
        ],
      },
    ],
  },
  // allow all imports from within tests
  overrides: [
    {
      files: "./test/**/*",
      rules: {
        "@typescript-eslint/no-restricted-imports": "off",
        "better-tree-shaking/no-top-level-side-effects": "off",
      },
    },
  ],
};
