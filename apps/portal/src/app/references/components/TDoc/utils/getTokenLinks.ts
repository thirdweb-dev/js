import type { TokenInfo } from "typedoc-better-json";
import { getAllTSReferencesLinks } from "./getAllTSReferencesLinkMap";

export async function getTokenLinks(
  tokens: TokenInfo[],
): Promise<Map<string, string>> {
  const linkMap = new Map<string, string>();
  const validReferenceLinks = await getAllTSReferencesLinks();

  function setLink(key: string, value: string) {
    if (validReferenceLinks.has(value)) {
      linkMap.set(key, value);
    }
  }

  for (const token of tokens) {
    if (token.package) {
      switch (token.package) {
        case "thirdweb": {
          setLink(token.name, `/references/typescript/v5/${token.name}`);
          break;
        }
      }
    }
  }

  return linkMap;
}
