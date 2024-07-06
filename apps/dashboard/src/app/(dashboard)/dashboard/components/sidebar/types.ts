export type SidebarNavLink = {
  id: string;
  title: string;
  href: string;
};

export type SidebarNavSection = {
  id: string;
  title: string;
  // TODO: make sections be able to be in items when we need nested sections
  items: Array<SidebarNavLink>;
};
