import { AppFooter } from "@/components/blocks/app-footer";
import { ErrorProvider } from "../../contexts/error-handler";
import { TeamHeader } from "../team/components/TeamHeader/team-header";

export default function DashboardLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <ErrorProvider>
      <div className="flex min-h-dvh flex-col bg-background">
        <div className="border-border border-b bg-muted/50">
          <TeamHeader />
        </div>
        <div className="flex grow flex-col">{props.children}</div>
        <AppFooter />
      </div>
    </ErrorProvider>
  );
}
