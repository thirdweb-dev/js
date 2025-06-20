module.exports = {
  env: {
    browser: true,
    node: true,
  },
  overrides: [
    // THIS NEEDS TO GO LAST!
    {
      extends: ["biome"],
      files: ["*.ts", "*.js", "*.tsx", "*.jsx"],
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
    ecmaVersion: 2019,
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
  rules: {
    "no-restricted-syntax": [
      "warn",
      {
        message:
          'Are you *sure* you need to use "useEffect" here? If you loading any async function prefer using "useQuery".',
        selector: "CallExpression[callee.name='useEffect']",
      },
      {
        message:
          'Are you *sure* you need to use a "Context"? In almost all cases you should prefer passing props directly.',
        selector: "CallExpression[callee.name='createContext']",
      },
      {
        message: "Use getCachedChain instead for all internal usage",
        selector: "CallExpression[callee.name='defineChain']",
      },
    ],
    "no-unused-vars": [
      "warn",
      {
        args: "none",
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        ignoreRestSiblings: true,
        varsIgnorePattern: "^_", // Ignore variables used in type definitions
      },
    ],
    "tsdoc/syntax": "warn",
  },
};
