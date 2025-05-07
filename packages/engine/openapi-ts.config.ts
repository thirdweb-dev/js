import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:3009/openapi", // TODO: update to prod
  output: { path: "src/client", lint: "biome", format: "biome" },
  plugins: ["@hey-api/client-fetch"],
});
