export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  return (
    <div className="flex grow flex-col">
      <h1 className="font-semibold text-3xl tracking-tight">
        Project Settings
      </h1>
      <div className="py-6">{props.children}</div>
    </div>
  );
}
