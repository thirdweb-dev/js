import { transform } from "typedoc-better-json";
import { fetchReactCoreDoc } from "./fetchReactCoreDoc";
import { mergeDocs } from "./mergeDocs";
import { fetchJSON } from "@/lib/fetchJSON";
import { withCache } from "../../../../../lib/withCache";

export async function fetchReactDoc() {
	const URL =
		"https://raw.githubusercontent.com/thirdweb-dev/js/main/legacy_packages/react/typedoc/documentation.json.gz";
	const doc = await withCache(() => fetchJSON(URL), {
		cacheKey: URL,
		// cache for 10min
		cacheTime: 10 * 60 * 1000,
	});
	const reactCoreDoc = await fetchReactCoreDoc();
	return mergeDocs(reactCoreDoc, transform(doc as any));
}
