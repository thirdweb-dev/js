export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  return (
    <div className="flex grow flex-col">
      <div className="border-b py-10">
        <div className="container max-w-7xl">
          <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
            Project Settings
          </h1>
        </div>
      </div>
      <div className="container max-w-7xl pt-6 pb-20">{props.children}</div>
    </div>
  );
}
