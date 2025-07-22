import { createMetadata } from "@doc";
import { DocLayout } from "@/components/Layouts/DocLayout";
import { EngineVersionSelector } from "../../../components/others/EngineVersionSelector";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      editPageButton={true}
      sideBar={sidebar}
      sidebarHeader={<EngineVersionSelector selected="v3" />}
    >
      {props.children}
    </DocLayout>
  );
}

export const metadata = createMetadata({
  description:
    "thirdweb Transactions is a backend HTTP server that calls smart contracts using your managed backend wallets.",
  title: "Transactions",
});
