import { getSearchIndexes } from "../indexing/createIndex";
import type {
  SearchResult,
  SearchResultItem,
  SearchResultSection,
} from "../types";

const maxResults = 100;

export async function search(query: string): Promise<SearchResult> {
  const { pageTitleIndex, sectionIndex, websiteData } =
    await getSearchIndexes();

  const titleMatches = pageTitleIndex.search(query, maxResults, {
    index: "title",
  });

  const pageTitleResults: SearchResultItem[] = [];
  const sectionContentResults: SearchResultItem[] = [];
  const sectionTitleResults: SearchResultItem[] = [];

  const pageIdToResultMap = new Map<number, SearchResultItem>();
  const sectionIdsAddedInResult = new Set<number>();

  // search query in page titles - high bias, so added first in results array
  const titleMatchResults = titleMatches[0]?.result as number[] | undefined;
  if (titleMatchResults) {
    for (const id of titleMatchResults) {
      if (!websiteData[id]) {
        continue;
      }
      const result: SearchResultItem = {
        pageHref: websiteData[id].href,
        pageTitle: websiteData[id].title,
      };
      pageTitleResults.push(result);
      pageIdToResultMap.set(id, result);
    }
  }

  if (pageTitleResults.length >= maxResults) {
    return {
      results: pageTitleResults,
    };
  }

  function createSectionResult(doc: {
    id: number;
    title: string;
    content: string;
    pageId: number;
    href: string;
  }) {
    // if section is already added in results, skip
    if (sectionIdsAddedInResult.has(doc.id)) {
      return;
    }

    sectionIdsAddedInResult.add(doc.id);

    // create section result object
    const sectionResult: SearchResultSection = {
      content: doc.content,
      href: doc.href,
      title: doc.title,
    };

    // if page it is in is already added in results - add section to it
    // else create new page result object and add section to it
    const pageResult = pageIdToResultMap.get(doc.pageId);

    if (pageResult) {
      if (pageResult.sections) {
        pageResult.sections.push(sectionResult);
      } else {
        pageResult.sections = [sectionResult];
      }
    } else {
      const pageData = websiteData[doc.pageId];
      if (!pageData) {
        return;
      }
      const pageResult: SearchResultItem = {
        pageHref: pageData.href,
        pageTitle: pageData.title,
        sections: [sectionResult],
      };

      pageIdToResultMap.set(doc.pageId, pageResult);
      return pageResult;
    }
  }

  const sectionTitleMatches = sectionIndex.search(
    query,
    maxResults - pageTitleResults.length,
    {
      enrich: true,
      index: "title",
    },
  );

  for (const result of sectionTitleMatches[0]?.result || []) {
    const sectionTitleResult = createSectionResult(result.doc);
    if (sectionTitleResult) {
      sectionTitleResults.push(sectionTitleResult);
    }
  }

  const sectionContentMatches = sectionIndex.search<true>(query, 100, {
    enrich: true,
    index: "content",
    suggest: true,
  });

  for (const result of sectionContentMatches[0]?.result || []) {
    const r = createSectionResult(result.doc);
    if (r) {
      sectionContentResults.push(r);
    }
  }

  const sortedSectionContentResults = sectionContentResults.sort((a, b) => {
    // page with more sections should be first
    const aSections = a.sections?.length || 0;
    const bSections = b.sections?.length || 0;

    if (aSections === bSections) {
      return a.pageTitle.localeCompare(b.pageTitle);
    }

    return bSections - aSections;
  });

  return {
    results: [
      // show matches in page titles first
      ...pageTitleResults,
      // then show matches in section titles
      ...sectionTitleResults,
      // then show matches in section content (with more sections first)
      ...sortedSectionContentResults,
    ],
  };
}
