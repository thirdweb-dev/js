module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@next/next/recommended",
  ],
  overrides: [
    // enable rule specifically for TypeScript files
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": ["off"],
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
              'Use `import { useRouter } from "@/lib/useRouter";` instead',
            name: "next/navigation",
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
