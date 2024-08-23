import { fetchTypeScriptDoc } from "./fetchTypeScriptDoc";
import { getSlugToDocMap } from "../utils/slugs";


export default async function fetchDocBySlug(slug: string) {
	const doc = await fetchTypeScriptDoc("v5");
	const slugToDoc = getSlugToDocMap(doc);

	const selectedDoc = slug && slugToDoc[slug];

  return selectedDoc;
}
