import { Settings2Icon } from "lucide-react";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  return (
    <div className="flex grow flex-col">
      <div className="border-b py-8">
        <div className="container max-w-7xl">
          <div className="mb-4 flex">
            <div className="p-2.5 rounded-full bg-card border">
              <Settings2Icon className="size-5 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="font-semibold tracking-tight text-3xl">
              Project Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure your project's settings and services
            </p>
          </div>
        </div>
      </div>
      <div className="container max-w-7xl pt-6 pb-20">{props.children}</div>
    </div>
  );
}
