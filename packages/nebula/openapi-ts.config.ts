import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	input: "https://nebula-api.thirdweb-dev.com/openapi.json",
	output: { format: "biome", lint: "biome", path: "src/client" },
	plugins: ["@hey-api/client-fetch"],
});
