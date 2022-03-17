module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:@next/next/recommended",
  ],
  rules: {
    // typescript
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        // future defaults
        "ts-expect-error": "allow-with-description",
        minimumDescriptionLength: 10,
      },
    ],
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          "{}": false,
        },
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-parameter-properties": "error",
    "@typescript-eslint/no-unused-vars": "warn",
    // import
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-cycle": "error",
    "import/no-default-export": "off",
    "import/no-useless-path-segments": "error",
    // react
    "react/forbid-dom-props": ["error", { forbid: ["className", "style"] }],
    "react/no-children-prop": "off",
    "react/prop-types": "off",
    // react-hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    // eslint
    curly: "error",
    eqeqeq: "error",
    "getter-return": "off",
    "key-spacing": [
      "error",
      { beforeColon: false, afterColon: true, mode: "strict" },
    ],
    "keyword-spacing": ["error", { before: true, after: true }],
    "line-comment-position": "error",
    "new-cap": "error",
    "no-alert": "error",
    "no-case-declarations": "off",

    "no-duplicate-imports": "error",
    "no-eval": "error",
    "no-floating-decimal": "error",
    "no-implicit-coercion": ["error", { boolean: false }],
    "no-implied-eval": "error",
    "no-irregular-whitespace": "error",
    "no-label-var": "error",
    "no-multiple-empty-lines": "error",
    "no-octal-escape": "error",
    "no-restricted-globals": ["error", "xdescribe", "fit", "fdescribe"],
    // has false positives
    "no-shadow": "off",
    // replaced with this
    "@typescript-eslint/no-shadow": "error",
    "no-tabs": "error",
    "no-template-curly-in-string": "error",
    "no-throw-literal": "error",
    "no-trailing-spaces": "error",
    "no-undef": "off",
    "no-unused-expressions": "error",
    "no-useless-computed-key": "error",
    "no-whitespace-before-property": "error",
    "object-curly-spacing": ["error", "always"],
    "object-shorthand": ["error", "always"],
    "prefer-const": "error",
    "prefer-object-spread": "error",
    "prefer-template": "error",
    "quote-props": ["error", "as-needed"],
    // 'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    // 'sort-keys': ['warn', 'asc', { natural: true }],
    "spaced-comment": ["error", "always", { markers: ["/ <reference"] }],
    "symbol-description": "error",
    "template-curly-spacing": ["error", "never"],
    "use-isnan": "error",
    "valid-typeof": "error",
    semi: ["warn", "always"],
    // Inclusive
    "inclusive-language/use-inclusive-words": "error",
    // turn off deprecated things?
    "react/react-in-jsx-scope": "off",
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "import",
    "inclusive-language",
    "react",
    "react-hooks",
  ],
  parserOptions: {
    ecmaVersion: 2019,
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
    warnOnUnsupportedTypeScriptVersion: true,
  },
  settings: {
    react: {
      createClass: "createReactClass",
      pragma: "React",
      version: "detect",
    },
  },
  overrides: [
    // enable rule specifically for TypeScript files
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": ["off"],
      },
    },
    // disable mandatory display-names in non-production code
    {
      files: ["package-examples/**", "prototyper/**"],
      rules: {
        "react/display-name": "off",
      },
    },

    // in test files, allow null assertions and anys and eslint is sometimes weird about the react-scope thing
    {
      files: ["*test.ts?(x)"],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off",

        "react/display-name": "off",
      },
    },
    // allow requires in non-transpiled JS files and logical key ordering in config files
    {
      files: [
        "babel-node.js",
        "*babel.config.js",
        "env.config.js",
        "next.config.js",
        "webpack.config.js",
        "packages/mobile-web/package-builder/**",
      ],
      rules: {},
    },

    // setupTests can have separated imports for logical grouping
    {
      files: ["setupTests.ts"],
      rules: {
        "import/newline-after-import": "off",
      },
    },
  ],
  env: {
    browser: true,
    node: true,
  },
};
