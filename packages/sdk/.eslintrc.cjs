module.exports = {
  root: true,
  extends: ["thirdweb"],
  rules: {
    "import/no-cycle": "off",
  },
  // allow all imports from within tests
  overrides: [
    {
      files: "./test/*",
      rules: {
        "@typescript-eslint/no-restricted-imports": "off",
      },
    },
  ],
};
