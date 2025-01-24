import { DocLayout } from "@/components/Layouts/DocLayout";
import { PlatformSelector } from "../../components/others/PlatformSelector";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      sideBar={sidebar}
      editPageButton={true}
      sidebarHeader={
        <div className="flex-col items-center gap-1">
          <p className="py-5 font-semibold text-foreground text-lg">Connect</p>
          <PlatformSelector selected="Overview" />
        </div>
      }
    >
      {props.children}
    </DocLayout>
  );
}
