module.exports = {
  extends: [
    "next",
    "turbo",
    "prettier",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",

    //typescript rules

    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "error",
    // making this an error going forward
    "@typescript-eslint/no-unused-vars": "error",

    // import rules
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-cycle": "error",
    "import/no-useless-path-segments": "error",

    //eslint
    curly: "error",
    eqeqeq: "error",
    "no-implicit-coercion": ["error", { boolean: false }],
    // has false positives
    "no-shadow": "off",
    // replaced with this
    "@typescript-eslint/no-shadow": "error",

    "no-unused-expressions": "error",
    "no-useless-computed-key": "error",

    "no-restricted-globals": [
      "warn",
      {
        name: "Buffer",
        message: "Use Uint8Array instead.",
      },
    ],
    "no-restricted-imports": [
      "warn",
      {
        name: "buffer",
        message: "Use Uint8Array instead.",
      },
      {
        name: "node:buffer",
        message: "Use Uint8Array instead.",
      },
    ],

    // no restricted imports
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@thirdweb-dev/contracts-js",
            message:
              "Please only import types directly from @thirdweb-dev/contracts-js",
            allowTypeImports: true,
          },
        ],
      },
    ],
    "@typescript-eslint/ban-types": [
      "warn",
      {
        types: {
          Buffer: {
            message: "Use Uint8Array instead.",
            suggest: ["Uint8Array"],
          },
        },
      },
    ],
  },
};
