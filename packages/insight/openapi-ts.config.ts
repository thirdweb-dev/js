import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://insight.thirdweb.com/openapi.json",
  output: { path: "src/client" },
  plugins: ["@hey-api/client-fetch"],
});
