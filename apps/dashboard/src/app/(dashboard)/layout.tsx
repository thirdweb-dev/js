import { AppFooter } from "@/components/blocks/app-footer";
import { DashboardHeader } from "app/components/Header/DashboardHeader";

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col h-full bg-background">
        <DashboardHeader />
        <main className="grow">{props.children}</main>
        <AppFooter />
      </div>
    </>
  );
}
