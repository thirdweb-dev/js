module.exports = {
  root: true,
  extends: ["thirdweb"],
  plugins: ["i18next"],
  rules: {
    "i18next/no-literal-string": 2,
  },
  settings: {
    // https://github.com/facebook/react-native/issues/28549
    "import/ignore": ["react-native"],
  },
};
