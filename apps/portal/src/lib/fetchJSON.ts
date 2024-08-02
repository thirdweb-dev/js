import { gunzip } from "node:zlib";
import { promisify } from "node:util";

export async function fetchJSON(url: string) {
	const s = performance.now();
	const response = await fetch(url, { cache: "no-store" });
	const e = performance.now();

	console.log("fetching", url, "took", e - s, "ms");

	if (!response.ok) {
		throw new Error(response.statusText);
	}

	if (url.endsWith(".json")) {
		try {
			return await response.json();
		} catch (e) {
			throw e;
		}
	} else if (url.endsWith(".json.gz")) {
		try {
			const arrayBuffer = await response.arrayBuffer();
			const json = await promisify(gunzip)(arrayBuffer);
			return JSON.parse(json.toString());
		} catch (e) {
			throw e;
		}
	}
	if (!response.bodyUsed) {
		await response.body?.cancel();
	}
	throw new Error("Unknown file type");
}
