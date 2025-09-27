import { createMetadata } from "@/components/Document";
import { DocLayout } from "@/components/Layouts/DocLayout";
import { PlatformSelector } from "../../../components/others/PlatformSelector";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      editPageButton={true}
      sideBar={sidebar}
      sidebarHeader={<PlatformSelector selected="Unity" />}
    >
      {props.children}
    </DocLayout>
  );
}

export const metadata = createMetadata({
  description:
    "Connect to user's wallets, interact with smart contracts, sign messages, and utilize common standards such as tokens, NFTs, marketplaces; all with built-in RPC URLs, IPFS gateways, and more.",
  image: {
    icon: "unity",
    title: "thirdweb Unity SDK",
  },
  title: "thirdweb Unity SDK",
});
