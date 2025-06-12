import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:4242/openapi.json",
  output: { path: "src/client", lint: "biome", format: "biome" },
  plugins: ["@hey-api/client-fetch"],
});
