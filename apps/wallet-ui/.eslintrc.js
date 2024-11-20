module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@next/next/recommended",
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
    ],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "next/navigation",
            importNames: ["useRouter"],
            message:
              'Use `import { useRouter } from "@/lib/useRouter";` instead',
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
    // enable rule specifically for TypeScript files
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": ["off"],
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
