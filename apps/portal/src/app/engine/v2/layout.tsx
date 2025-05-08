import { DocLayout } from "@/components/Layouts/DocLayout";
import { createMetadata } from "@doc";
import { EngineVersionSelector } from "../../../components/others/EngineVersionSelector";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      sideBar={sidebar}
      editPageButton={true}
      sidebarHeader={
        <div className="flex-col items-center gap-1">
          <p className="py-5 font-semibold text-foreground text-lg">Engine</p>
          <EngineVersionSelector selected="v2" />
        </div>
      }
    >
      {props.children}
    </DocLayout>
  );
}

export const metadata = createMetadata({
  title: "Engine",
  description:
    "Engine is a backend HTTP server that calls smart contracts using your managed backend wallets.",
});
