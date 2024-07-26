import { AppFooter } from "@/components/blocks/app-footer";
import { DashboardHeader } from "../components/Header/DashboardHeader";

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col h-full">
        <DashboardHeader />
        {/* min height: 100vh minus header */}
        <main className="grow min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-96px)]">
          {props.children}
        </main>
        <AppFooter />
      </div>
    </>
  );
}
