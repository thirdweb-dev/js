module.exports = {
  root: true,
  extends: ["thirdweb"],
  plugins: ["better-tree-shaking"],
  rules: {
    "better-tree-shaking/no-top-level-side-effects": "error",
  },
  // allow all imports from within tests
  overrides: [
    {
      files: "./test/**/*",
      rules: {
        "@typescript-eslint/no-restricted-imports": "off",
      },
    },
  ],
};
