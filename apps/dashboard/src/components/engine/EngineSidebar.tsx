import { SidebarNav } from "../../core-ui/sidebar/nav";

export function EngineSidebar() {
  return (
    <SidebarNav
      title="Engine"
      links={[
        {
          name: "overview",
          path: "/dashboard/engine",
          title: "Overview",
        },
        {
          name: "create",
          path: "/dashboard/engine/create",
          title: "Create",
        },
        {
          name: "import",
          path: "/dashboard/engine/import",
          title: "Import",
        },
      ]}
    />
  );
}
