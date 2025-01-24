import type { SomeDoc } from "@/app/references/components/TDoc/types";
import type { TransformedDoc } from "typedoc-better-json";
import { getExtensionName } from "./getSidebarLinkgroups";
import { subgroups } from "./subgroups";
import { uniqueSlugger } from "./uniqueSlugger";

export function fetchAllSlugs(doc: TransformedDoc) {
  const names = Object.keys(getSlugToDocMap(doc));

  // add slugs for category pages
  for (const _key in subgroups) {
    const slug = _key as keyof typeof subgroups;
    if (doc[slug]) {
      names.push(slug);
    }
  }

  return names;
}

export function getSlugToDocMap(doc: TransformedDoc) {
  const slugToDocMap: Record<string, SomeDoc> = {};

  const ensureUniqueSlug = (slug: string) => {
    return uniqueSlugger({
      base: slug,
      isUnique: (s) => !(s in slugToDocMap),
    });
  };

  for (const key in doc) {
    const value = doc[key as keyof TransformedDoc];
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v.kind === "function") {
          const extensionBlockTag = v.signatures
            ?.find((s) =>
              s.blockTags?.some(
                (tag) => tag.tag === "@extension" || tag.tag === "@modules",
              ),
            )
            ?.blockTags?.find(
              (tag) => tag.tag === "@extension" || tag.tag === "@modules",
            );

          if (extensionBlockTag) {
            const extensionName = getExtensionName(extensionBlockTag);
            if (extensionName) {
              const name = `${extensionName.toLowerCase()}/${v.name}`;

              slugToDocMap[ensureUniqueSlug(name)] = v;

              // skip to next loop
              continue;
            }
          }
        }

        slugToDocMap[ensureUniqueSlug(v.name)] = v;
      }
    }
  }

  return slugToDocMap;
}
