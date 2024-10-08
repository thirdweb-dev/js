import { AppFooter } from "@/components/blocks/app-footer";
import { ErrorProvider } from "../../contexts/error-handler";
import { TryTeamsUIBanner } from "../components/DashboardTypeBanner";
import { DashboardHeader } from "../components/Header/DashboardHeader";

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <ErrorProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <TryTeamsUIBanner />
        <DashboardHeader />
        <main className="grow">{props.children}</main>
        <AppFooter />
      </div>
    </ErrorProvider>
  );
}
