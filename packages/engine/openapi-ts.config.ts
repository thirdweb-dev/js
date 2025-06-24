import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	// input: "https://engine.thirdweb.com/openapi",
	input: "http://localhost:3009/openapi",
	output: { format: "biome", lint: "biome", path: "src/client" },
	plugins: ["@hey-api/client-fetch"],
});
