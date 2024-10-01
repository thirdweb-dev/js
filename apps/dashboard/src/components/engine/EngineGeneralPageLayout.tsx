import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export function EngineGeneralPageLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout
      sidebarLinks={[
        {
          label: "Overview",
          exactMatch: true,
          href: "/dashboard/engine",
        },
        {
          label: "Create",
          href: "/dashboard/engine/create",
        },
        {
          label: "Import",
          href: "/dashboard/engine/import",
        },
      ]}
    >
      {props.children}
    </SidebarLayout>
  );
}
