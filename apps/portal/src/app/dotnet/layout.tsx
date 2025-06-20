import { createMetadata } from "@/components/Document";
import { DocLayout } from "@/components/Layouts/DocLayout";
import { PlatformSelector } from "../../components/others/PlatformSelector";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      editPageButton={true}
      sideBar={sidebar}
      sidebarHeader={
        <div className="flex-col items-center gap-1">
          <p className="py-5 font-semibold text-foreground text-lg">Connect</p>
          <PlatformSelector selected=".NET" />
        </div>
      }
    >
      {props.children}
    </DocLayout>
  );
}

export const metadata = createMetadata({
  description:
    "Connect to user's wallets, interact with smart contracts, sign in with email or phone number, unlock Account Abstraction features; all with built-in RPC URLs, IPFS gateways, Godot support and more.",
  image: {
    icon: "dotnet",
    title: "thirdweb .NET SDK",
  },
  title: "thirdweb .NET SDK",
});
