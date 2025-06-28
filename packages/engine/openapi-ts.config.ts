import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://engine.thirdweb.com/openapi",
  output: { format: "biome", lint: "biome", path: "src/client" },
});
