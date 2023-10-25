import { typedoc } from "typedoc-gen";

typedoc({
  entryPoints: ["src/index.ts"],
  exclude: [],
  outFile: "typedoc/documentation.json",
});
