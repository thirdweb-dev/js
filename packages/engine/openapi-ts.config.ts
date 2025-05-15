import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://engine.thirdweb.com/openapi",
  output: { path: "src/client", lint: "biome", format: "biome" },
  plugins: ["@hey-api/client-fetch"],
});
