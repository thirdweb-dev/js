import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export const ContractsSidebarLayout = (props: {
  children: React.ReactNode;
  desktopSidebarClassName?: string;
  mobileSidebarClassName?: string;
}) => {
  return (
    <SidebarLayout
      desktopSidebarClassName={props.desktopSidebarClassName}
      mobileSidebarClassName={props.mobileSidebarClassName}
      sidebarLinks={[
        { href: "/dashboard/contracts/deploy", label: "Deploy" },
        {
          href: "/dashboard/contracts/publish",
          label: "Publish",
        },
        {
          href: "/explore",
          label: "Explore",
        },
        { href: "/dashboard/contracts/build", label: "Build" },
        {
          href: "/trending",
          label: "Trending",
        },
      ]}
    >
      {props.children}
    </SidebarLayout>
  );
};
