import type { SidebarLink } from "@/components/blocks/Sidebar";

export function getEngineGeneralSidebarLinks(
  linkPrefix: string,
): SidebarLink[] {
  return [
    {
      label: "Overview",
      href: `${linkPrefix}`,
      exactMatch: true,
    },
    {
      label: "Create",
      href: `${linkPrefix}/create`,
    },
    {
      label: "Import",
      href: `${linkPrefix}/import`,
    },
  ];
}
