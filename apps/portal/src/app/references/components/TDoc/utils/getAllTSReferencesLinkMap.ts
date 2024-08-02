import { TransformedDoc } from "typedoc-better-json";
import { fetchReactDoc } from "../fetchDocs/fetchReactDoc";
import { fetchReactNativeDoc } from "../fetchDocs/fetchReactNativeDoc";
import { fetchStorageDoc } from "../fetchDocs/fetchStorageDoc";
import { fetchTypeScriptDoc } from "../fetchDocs/fetchTypeScriptDoc";
import { fetchWalletsDoc } from "../fetchDocs/fetchWalletsDoc";

const validReferenceLinks: Set<string> = new Set();

// TODO: currently we just point to /latest/ for all the links

/**
 * Get the map of all valid reference links for typescript pacakges
 */
export async function getAllTSReferencesLinks() {
	if (validReferenceLinks.size > 0) {
		return validReferenceLinks;
	}

	const [
		typescriptDoc,
		typescriptv5Doc,
		reactCode,
		reactNativeDoc,
		walletsDoc,
		storageDoc,
	] = await Promise.all([
		fetchTypeScriptDoc("v4"),
		fetchTypeScriptDoc("v5"),
		fetchReactDoc(),
		fetchReactNativeDoc(),
		fetchWalletsDoc(),
		fetchStorageDoc(),
	]);

	function addLinks(path: string, doc: TransformedDoc, version = "latest") {
		for (const key in doc) {
			const value = doc[key as keyof TransformedDoc];
			if (Array.isArray(value)) {
				value.forEach((v) => {
					validReferenceLinks.add(`/references/${path}/${version}/${v.name}`);
				});
			}
		}
	}

	addLinks("typescript", typescriptDoc, "v4");
	addLinks("react", reactCode);
	addLinks("react-native", reactNativeDoc);
	addLinks("wallets", walletsDoc);
	addLinks("storage", storageDoc);
	addLinks("typescript", typescriptv5Doc, "v5");

	return validReferenceLinks;
}
