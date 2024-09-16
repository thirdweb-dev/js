import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export const SettingsSidebarLayout = (props: {
  children: React.ReactNode;
}) => {
  return (
    <SidebarLayout
      sidebarLinks={[
        {
          href: "/dashboard/settings/api-keys",
          label: "API Keys",
        },
        { href: "/dashboard/settings/devices", label: "Devices" },
        {
          href: "/dashboard/settings/billing",
          label: "Billing",
        },
        {
          href: "/dashboard/settings/gas-credits",
          label: "Gas Credits",
        },
        { href: "/dashboard/settings/usage", label: "Usage" },
        {
          href: "/dashboard/settings/storage",
          label: "Storage",
        },
        {
          href: "/dashboard/settings/notifications",
          label: "Notifications",
        },
      ]}
    >
      {props.children}
    </SidebarLayout>
  );
};
