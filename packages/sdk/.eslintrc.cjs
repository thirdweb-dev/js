module.exports = {
  root: true,
  extends: ["thirdweb"],
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
