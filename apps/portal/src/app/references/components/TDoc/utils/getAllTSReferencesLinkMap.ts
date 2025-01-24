import type { TransformedDoc } from "typedoc-better-json";
import { fetchTypeScriptDoc } from "../fetchDocs/fetchTypeScriptDoc";

const validReferenceLinks: Set<string> = new Set();

/**
 * Get the map of all valid reference links for typescript pacakges
 */
export async function getAllTSReferencesLinks() {
  if (validReferenceLinks.size > 0) {
    return validReferenceLinks;
  }

  const typescriptDoc = await fetchTypeScriptDoc();

  function addLinks(path: string, doc: TransformedDoc, version = "latest") {
    for (const key in doc) {
      const value = doc[key as keyof TransformedDoc];
      if (Array.isArray(value)) {
        for (const v of value) {
          validReferenceLinks.add(`/references/${path}/${version}/${v.name}`);
        }
      }
    }
  }

  addLinks("typescript", typescriptDoc, "v5");

  return validReferenceLinks;
}
