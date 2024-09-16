import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export default function Layout(props: {
  params: {
    team_slug: string;
    project_slug: string;
  };
  children: React.ReactNode;
}) {
  const { team_slug, project_slug } = props.params;

  const links: { label: string; href: string }[] = [
    {
      label: "Analytics",
      href: `/team/${team_slug}/${project_slug}/connect/analytics`,
    },
    {
      label: "In-App Wallets",
      href: `/team/${team_slug}/${project_slug}/connect/in-app-wallets`,
    },
    {
      label: "Ecosystem Wallets",
      href: `/team/${team_slug}/${project_slug}/connect/ecosystem`,
    },
    {
      label: "Account Abstraction",
      href: `/team/${team_slug}/${project_slug}/connect/account-abstraction`,
    },
    {
      label: "Pay",
      href: `/team/${team_slug}/${project_slug}/connect/pay`,
    },
    {
      label: "Playground",
      href: "https://playground.thirdweb.com/connect/sign-in/button",
    },
  ];

  return <SidebarLayout sidebarLinks={links}>{props.children}</SidebarLayout>;
}
