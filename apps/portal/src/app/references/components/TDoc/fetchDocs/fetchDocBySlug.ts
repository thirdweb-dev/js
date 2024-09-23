import { getSlugToDocMap } from "../utils/slugs";
import { fetchTypeScriptDoc } from "./fetchTypeScriptDoc";

export default async function fetchDocBySlug(slug: string) {
  const doc = await fetchTypeScriptDoc("v5");
  const slugToDoc = getSlugToDocMap(doc);

  const selectedDoc = slug && slugToDoc[slug];

  return selectedDoc;
}
