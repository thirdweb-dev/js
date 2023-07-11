module.exports = {
  root: true,
  extends: ["thirdweb"],
  plugins: ["better-tree-shaking"],
  rules: {
    "better-tree-shaking/no-top-level-side-effects": "error",
  },
};
