module.exports = {
  root: true,
  extends: ["thirdweb"],
  plugins: ["better-tree-shaking", "eslint-plugin-tsdoc"],
  rules: {
    "tsdoc/syntax": "error",
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
        name: "buffer",
        message: "Use Uint8Array instead.",
      },
      {
        name: "node:buffer",
        message: "Use Uint8Array instead.",
      },
    ],
  },
};
