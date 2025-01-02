module.exports = {
  rules: {
    "no-restricted-syntax": [
      "warn",
      {
        selector: "CallExpression[callee.name='useEffect']",
        message:
          'Are you *sure* you need to use "useEffect" here? If you loading any async function prefer using "useQuery".',
      },
      {
        selector: "CallExpression[callee.name='createContext']",
        message:
          'Are you *sure* you need to use a "Context"? In almost all cases you should prefer passing props directly.',
      },
      {
        selector: "CallExpression[callee.name='defineChain']",
        message: "Use getCachedChain instead for all internal usage",
      },
    ],
    "no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        ignoreRestSiblings: true,
        args: "none", // Ignore variables used in type definitions
      },
    ],
    "tsdoc/syntax": "warn",
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
  parserOptions: {
    ecmaVersion: 2019,
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
    warnOnUnsupportedTypeScriptVersion: false,
  },
  overrides: [
    // THIS NEEDS TO GO LAST!
    {
      files: ["*.ts", "*.js", "*.tsx", "*.jsx"],
      extends: ["biome"],
    },
  ],
  env: {
    browser: true,
    node: true,
  },
};
