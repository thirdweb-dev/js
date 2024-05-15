module.exports = {
  root: true,
  extends: ["thirdweb"],
  plugins: ["better-tree-shaking", "eslint-plugin-tsdoc"],
  rules: {
    "tsdoc/syntax": "error",
    "better-tree-shaking/no-top-level-side-effects": "error",
  },
};
