import { DashboardHeader } from "../components/Header/DashboardHeader";
import { DashboardFooter } from "../components/DashboardFooter";

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col h-full">
        <DashboardHeader />
        <main className="grow">{props.children}</main>
        <DashboardFooter />
      </div>
    </>
  );
}
