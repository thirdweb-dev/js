import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://nebula-api.thirdweb-dev.com/openapi.json",
  output: { path: "src/client", lint: "biome", format: "biome" },
  plugins: ["@hey-api/client-fetch"],
});
