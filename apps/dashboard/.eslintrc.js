module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:@next/next/recommended",
    "plugin:promise/recommended",
  ],
  rules: {
    "react-compiler/react-compiler": "error",
    "no-restricted-syntax": [
      "error",
      {
        selector: "CallExpression[callee.name='useEffect']",
        message:
          'Are you *sure* you need to use "useEffect" here? If you loading any async function prefer using "useQuery".',
      },
      {
        selector: "CallExpression[callee.name='defineChain']",
        message:
          "Use useV5DashboardChain instead if you are using it inside a component",
      },
      {
        selector: "CallExpression[callee.name='defineDashboardChain']",
        message:
          "Use useV5DashboardChain instead if you are using it inside a component",
      },
      {
        selector: "CallExpression[callee.name='mapV4ChainToV5Chain']",
        message:
          "Use useV5DashboardChain instead if you are using it inside a component",
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@chakra-ui/react",
            // these are provided by tw-components, so we don't want to import them from chakra directly
            importNames: [
              "Card",
              "Button",
              "Checkbox",
              "Badge",
              "Drawer",
              "Heading",
              "Text",
              "FormLabel",
              "FormHelperText",
              "FormErrorMessage",
              "MenuGroup",
              "MenuItem",
              // also the types
              "ButtonProps",
              "BadgeProps",
              "DrawerProps",
              "HeadingProps",
              "TextProps",
              "FormLabelProps",
              "HelpTextProps",
              "MenuGroupProps",
              "MenuItemProps",
            ],
            message:
              'Use the equivalent component from "tw-components" instead.',
          },
          {
            name: "@chakra-ui/layout",
            message:
              "Import from `@chakra-ui/react` instead of `@chakra-ui/layout`.",
          },
          {
            name: "@chakra-ui/button",
            message:
              "Import from `@chakra-ui/react` instead of `@chakra-ui/button`.",
          },
          {
            name: "@chakra-ui/menu",
            message:
              "Import from `@chakra-ui/react` instead of `@chakra-ui/menu`.",
          },
        ],
      },
    ],
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "react-compiler"],
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
    {
      files: "src/core-ui/**/*",
      rules: {
        // no restricted imports
        "@typescript-eslint/no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "@thirdweb-dev/sdk",
                message:
                  "core-ui should not import from @thirdweb-dev/sdk. (except for types)",
                allowTypeImports: true,
              },
              {
                name: "@thirdweb-dev/react",
                message:
                  "core-ui should not import from @thirdweb-dev/react. (except for types)",
                allowTypeImports: true,
              },
            ],
          },
        ],
      },
    },
    // disable restricted imports in tw-components
    {
      files: "src/tw-components/**/*",
      rules: {
        "no-restricted-imports": ["off"],
      },
    },
    // enable rule specifically for TypeScript files
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": ["off"],
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
