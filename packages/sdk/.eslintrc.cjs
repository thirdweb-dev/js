module.exports = {
  root: true,
  extends: ["thirdweb"],
  plugins: ["better-tree-shaking"],
  rules: {
    "better-tree-shaking/no-top-level-side-effects": "error",
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
      },
    },
  ],
};
