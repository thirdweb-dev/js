import type { SidebarLink } from "@/components/others/Sidebar";

interface NextPageInfo {
  href: string;
  name: string;
}

// Helper function to flatten sidebar links into a linear array
function flattenSidebarLinks(
  links: SidebarLink[],
): Array<{ href: string; name: string }> {
  const result: Array<{ href: string; name: string }> = [];

  for (const link of links) {
    if ("separator" in link) {
      // Skip separators
      continue;
    }

    if ("links" in link) {
      // Handle LinkGroup
      if (link.href) {
        result.push({ href: link.href, name: link.name });
      }
      // Recursively flatten nested links
      result.push(...flattenSidebarLinks(link.links));
    } else {
      // Handle LinkMeta
      result.push({ href: link.href, name: link.name });
    }
  }

  return result;
}

// Helper function to check if two paths are the same
function isSamePage(pathname: string, pathOrHref: string): boolean {
  try {
    if (pathOrHref === pathname) {
      return true;
    }

    // Handle relative URLs by creating full URLs
    const currentUrl = new URL(pathname, "http://localhost");
    const linkUrl = new URL(pathOrHref, "http://localhost");

    return currentUrl.pathname === linkUrl.pathname;
  } catch {
    return false;
  }
}

export function getNextPageFromSidebar(
  sidebarLinks: SidebarLink[],
  currentPathname: string,
): NextPageInfo | null {
  // Flatten all sidebar links into a linear array
  const flatLinks = flattenSidebarLinks(sidebarLinks);

  // Find the current page index
  const currentIndex = flatLinks.findIndex((link) =>
    isSamePage(currentPathname, link.href),
  );

  // If current page is not found or is the last page, return null
  if (currentIndex === -1 || currentIndex === flatLinks.length - 1) {
    return null;
  }

  // Return the next page
  const nextPage = flatLinks[currentIndex + 1];
  if (!nextPage) {
    return null;
  }

  return {
    href: nextPage.href,
    name: nextPage.name,
  };
}
