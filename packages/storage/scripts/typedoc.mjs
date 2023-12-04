// @ts-check
import { typedoc } from "typedoc-gen";

typedoc({
  entryPoints: ["src/index.ts"],
  exclude: [],
  output: "both", // TODO: change this to 'json' when old portal is fully migrated to new portal
});
