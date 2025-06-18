module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@next/next/recommended",
    "plugin:storybook/recommended",
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
        selector: "CallExpression[callee.name='createContext']",
        message:
          'Are you *sure* you need to use a "Context"? In almost all cases you should prefer passing props directly.',
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
      {
        selector: "CallExpression[callee.name='resolveScheme']",
        message:
          "resolveScheme can throw error if resolution fails. Either catch the error and ignore the lint warning or Use `resolveSchemeWithErrorHandler` / `replaceIpfsUrl` utility in dashboard instead",
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
              "VStack",
              "HStack",
              "AspectRatio",
              "useToast",
              "useClipboard",
              "Badge",
              "Stack",
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
              "AspectRatioProps",
              "BadgeProps",
              "StackProps",
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
          {
            name: "next/navigation",
            importNames: ["useRouter"],
            message:
              'Use `import { useDashboardRouter } from "@/lib/DashboardRouter";` instead',
          },
          {
            name: "lucide-react",
            importNames: ["Link", "Table", "Sidebar"],
            message:
              'This is likely a mistake. If you really want to import this - postfix the imported name with Icon. Example - "LinkIcon"',
          },
          {
            name: "posthog-js",
            message:
              'Import "posthog-js" directly only within the analytics helpers ("src/@/analytics/*"). Use the exported helpers from "@/analytics/track" elsewhere.',
          },
        ],
      },
    ],
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-compiler"],
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
    // disable restricted imports in tw-components
    {
      files: "src/tw-components/**/*",
      rules: {
        "no-restricted-imports": ["off"],
      },
    },
    // allow direct PostHog imports inside analytics helpers
    {
      files: "src/@/analytics/**/*",
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
