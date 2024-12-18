import { transform } from "typedoc-better-json";
import { readFile, writeFile } from "fs/promises";

const inputPath = "typedoc/documentation.json";
const outputPath = "typedoc/parsed.json";

try {
	const fileContent = await readFile(inputPath, "utf-8");
	const fileData = JSON.parse(fileContent);

	const transformedData = transform(fileData);

	await writeFile(outputPath, JSON.stringify(transformedData, null, 2));

	console.log(`File saved at ${outputPath}`);
} catch (error) {
	console.error("Error:", error);
	process.exit(1);
}
