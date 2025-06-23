module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@next/next/recommended",
    "plugin:storybook/recommended",
  ],
  overrides: [
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
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",

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
    // turn OFF unused vars because biome handles it
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
      },
    },

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
    warnOnUnsupportedTypeScriptVersion: true,
  },
  plugins: ["@typescript-eslint", "react-compiler"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            importNames: ["useRouter"],
            message:
              'Use `import { useDashboardRouter } from "@/lib/DashboardRouter";` instead',
            name: "next/navigation",
          },
          {
            importNames: ["Link", "Table", "Sidebar"],
            message:
              'This is likely a mistake. If you really want to import this - postfix the imported name with Icon. Example - "LinkIcon"',
            name: "lucide-react",
          },
        ],
      },
    ],
    "no-restricted-syntax": [
      "error",
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
        message:
          "resolveScheme can throw error if resolution fails. Either catch the error and ignore the lint warning or Use `resolveSchemeWithErrorHandler` / `replaceIpfsUrl` utility in dashboard instead",
        selector: "CallExpression[callee.name='resolveScheme']",
      },
    ],
    "react-compiler/react-compiler": "error",
  },
  settings: {
    react: {
      createClass: "createReactClass",
      pragma: "React",
      version: "detect",
    },
  },
};
