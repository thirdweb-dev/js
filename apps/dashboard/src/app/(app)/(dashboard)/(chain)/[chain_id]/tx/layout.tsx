import { TeamHeader } from "../../../../team/components/TeamHeader/team-header";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex grow flex-col">
      <div className="border-border border-b bg-card">
        <TeamHeader />
      </div>
      {children}
    </div>
  );
}
