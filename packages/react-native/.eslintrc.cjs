module.exports = {
  root: true,
  extends: ["thirdweb"],
  plugins: ["i18next", "eslint-plugin-tsdoc"],
  rules: {
    "tsdoc/syntax": "error",
    "i18next/no-literal-string": 2,
    "no-restricted-imports": [
      "error",
      {
        paths: [
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
  settings: {
    // https://github.com/facebook/react-native/issues/28549
    "import/ignore": ["react-native"],
  },
};
