import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://engine-cloud-dev-l8wt.chainsaw-dev.zeet.app/openapi", // TODO: update to prod
  output: { path: "src/client" },
  plugins: ["@hey-api/client-fetch"],
});
