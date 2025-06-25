import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://engine.thirdweb-dev.com/openapi",
  // input: "http://localhost:3001/openapi",
  output: { format: "biome", lint: "biome", path: "src/client" },
});
