// @ts-check
import { typedoc } from "typedoc-gen";

typedoc({
  entryPoints: ["src/exports/**/*.ts"],
  exclude: [
    "src/exports/react-native.ts",
    "test/**/*",
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/**/*.bench.ts",
  ],
});
