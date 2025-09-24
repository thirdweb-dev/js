import { defineConfig } from "tsup";
import pkg from "./package.json";

export default defineConfig([
  // bridge-widget
  {
    entry: ["src/script-exports/bridge-widget.tsx"],
    sourcemap: false,
    clean: false, // don't delete the outDir before build
    minify: true,
    format: "iife",
    platform: "browser", // fixes dynamic import not found errors
    target: "es2020",
    dts: true,
    outDir: "dist/scripts",
    outExtension: () => ({
      js: `.js`, // bridge-widget.js
    }),
    globalName: "BridgeWidget",
    replaceNodeEnv: true, // replaces process.env.NODE_ENV with "production"
    banner: {
      js: `// ${pkg.name}/scripts/bridge-widget@${pkg.version}`,
    },
    esbuildOptions(options) {
      options.legalComments = "none";
    },
    tsconfig: "tsconfig.build.tsup.json",
  },
]);
