import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export function ConnectSidebarLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout
      sidebarLinks={[
        {
          label: "Analytics",
          href: "/dashboard/connect/analytics",
        },
        {
          label: "In-App Wallets",
          href: "/dashboard/connect/in-app-wallets",
        },
        {
          label: "Ecosystem Wallets",
          href: "/dashboard/connect/ecosystem",
        },
        {
          label: "Account Abstraction",
          href: "/dashboard/connect/account-abstraction",
        },
        {
          label: "Pay",
          href: "/dashboard/connect/pay",
        },
        {
          label: "Playground",
          href: "https://playground.thirdweb.com/connect/sign-in/button",
        },
      ]}
    >
      {props.children}
    </SidebarLayout>
  );
}
