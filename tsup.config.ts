import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  clean: true,
  minify: !options.watch,
  dts: !options.watch,
  format: ["cjs", "esm"],
  sourcemap: true,
  target: "node16",
}));
