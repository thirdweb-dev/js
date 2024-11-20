import type { SideBar } from "@/components/Layouts/DocLayout";
import type { SidebarLink } from "@/components/others/Sidebar";
import { createMetadata } from "@doc";

export const createUnrealEngineMetadata = (
  params: Parameters<typeof createMetadata>[0],
) =>
  createMetadata({
    ...params,
    title: `${params.title} | Thirdweb Unreal Engine SDK`,
  });
export const hrefBuilder = <T extends SideBar | SidebarLink>(
  root: string,
  data: T,
): T => {
  if ("href" in data) {
    data.href = `${root}/${data.href}`
      .replace(/(\/\/)/g, "/")
      .replace(/\/$/, "");
  }
  if ("links" in data) {
    data.links = data.links.map((l) => hrefBuilder(root, l));
  }
  return data as T;
};
