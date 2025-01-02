import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export default function Layout(props: {
  children: React.ReactNode;
}) {
  const layoutPath = "/account/contracts";

  return (
    <SidebarLayout
      sidebarLinks={[
        {
          href: layoutPath,
          label: "Deployed contracts",
          exactMatch: true,
        },
        {
          href: `${layoutPath}/published`,
          label: "Published contracts",
          exactMatch: true,
        },
      ]}
    >
      {props.children}
    </SidebarLayout>
  );
}
