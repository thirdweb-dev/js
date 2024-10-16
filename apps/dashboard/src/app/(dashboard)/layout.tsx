import { AppFooter } from "@/components/blocks/app-footer";
import { ErrorProvider } from "../../contexts/error-handler";
import { DashboardHeader } from "../components/Header/DashboardHeader";

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <ErrorProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <DashboardHeader />
        <div className="flex grow flex-col">{props.children}</div>
        <AppFooter />
      </div>
    </ErrorProvider>
  );
}
