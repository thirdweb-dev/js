import TeamTabs from "../components/tab-switcher.client";

export default function TeamLayout(props: {
  children: React.ReactNode;
  breadcrumbNav: React.ReactNode;
  params: { team_slug: string; project_slug: string };
}) {
  return (
    <>
      <div className="bg-card">
        <TeamTabs
          links={[
            {
              href: `/team/${props.params.team_slug}/${props.params.project_slug}/connect`,
              name: "Connect",
              isEnabled: true,
            },
            {
              href: `/team/${props.params.team_slug}/${props.params.project_slug}/contracts`,
              name: "Contracts",
              isEnabled: true,
            },
            {
              href: `/team/${props.params.team_slug}/${props.params.project_slug}/engine`,
              name: "Engine",
              isEnabled: true,
            },
            {
              href: `/team/${props.params.team_slug}/${props.params.project_slug}/settings`,
              name: "Settings",
              isEnabled: true,
            },
          ]}
        />
      </div>
      <main>{props.children}</main>
    </>
  );
}
