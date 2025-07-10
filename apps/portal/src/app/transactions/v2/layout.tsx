import { createMetadata } from "@doc";
import { DocLayout } from "@/components/Layouts/DocLayout";
import { EngineVersionSelector } from "../../../components/others/EngineVersionSelector";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      editPageButton={true}
      sideBar={sidebar}
      sidebarHeader={
        <div className="flex-col items-center gap-1">
          <p className="py-5 font-semibold text-foreground text-lg">
            Transactions
          </p>
          <EngineVersionSelector selected="v2" />
        </div>
      }
    >
      {props.children}
    </DocLayout>
  );
}

export const metadata = createMetadata({
  description:
    "Engine is a backend HTTP server that calls smart contracts using your managed backend wallets.",
  title: "Engine",
});
