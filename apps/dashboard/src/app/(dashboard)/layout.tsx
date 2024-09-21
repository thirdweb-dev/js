import { AppFooter } from "@/components/blocks/app-footer";
import { DashboardHeader } from "app/components/Header/DashboardHeader";
import { ErrorProvider } from "../../contexts/error-handler";

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <ErrorProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="grow">{props.children}</main>
        <AppFooter />
      </div>
    </ErrorProvider>
  );
}
