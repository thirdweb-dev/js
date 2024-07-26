import TeamTabs from "../components/tab-switcher.client";

export default function TeamLayout(props: {
  children: React.ReactNode;
  breadcrumbNav: React.ReactNode;
  params: { team_slug: string };
}) {
  return (
    <>
      <div className="bg-card">
        <TeamTabs
          links={[
            {
              href: `/team/${props.params.team_slug}`,
              name: "Projects",
              isEnabled: true,
            },
            {
              href: `/team/${props.params.team_slug}/~/members`,
              name: "Members",
              isEnabled: true,
            },
            {
              href: `/team/${props.params.team_slug}/~/settings`,
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
