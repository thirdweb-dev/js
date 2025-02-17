export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  return (
    <div className="flex grow flex-col">
      <div className="border-border border-b py-10">
        <div className="container max-w-[1000px]">
          <h1 className="font-semibold text-3xl tracking-tight">
            Project Settings
          </h1>
        </div>
      </div>
      <div className="container max-w-[1000px] py-6">{props.children}</div>
    </div>
  );
}
