import { Sidebar } from "@/components/blocks/Sidebar";
import { ConnectMobileSidebar } from "../connect/ConnectMobileSidebar";

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
      label: "Contracts",
      href: `/team/${team_slug}/${project_slug}/contracts`,
    },
  ];

  return (
    <div className="h-full container flex gap-4">
      <Sidebar links={links} />
      <div className="grow max-sm:pt-6 max-sm:w-full">
        <ConnectMobileSidebar links={links} />
        {props.children}
      </div>
    </div>
  );
}
