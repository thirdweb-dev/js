module.exports = {
  root: true,
  extends: ["thirdweb", "plugin:i18next/recommended"],
  plugins: ["better-tree-shaking", "eslint-plugin-tsdoc"],
  rules: {
    "tsdoc/syntax": "warn",
    "@next/next/no-img-element": "off",
    "better-tree-shaking/no-top-level-side-effects": "error",
    "i18next/no-literal-string": 2,
  },
};
