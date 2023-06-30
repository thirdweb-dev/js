module.exports = {
  root: true,
  extends: ["thirdweb"],
  plugins: ["better-tree-shaking"],
  rules: {
    "@next/next/no-img-element": "off",
    "better-tree-shaking/no-top-level-side-effects": "error",
  },
};
