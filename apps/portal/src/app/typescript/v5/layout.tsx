import { createMetadata } from "@doc";
import { DocLayout } from "@/components/Layouts/DocLayout";
import { PlatformSelector } from "../../../components/others/PlatformSelector";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      editPageButton={true}
      sideBar={sidebar}
      sidebarHeader={
        <div className="flex-col items-center gap-1">
          <p className="py-5 font-semibold text-foreground text-lg">Connect</p>
          <PlatformSelector selected="TypeScript" />
        </div>
      }
    >
      <div>{props.children}</div>
    </DocLayout>
  );
}

export const metadata = createMetadata({
  description:
    "A type-safe library to interact with any EVM-compatible blockchain in Node, web and native applications.",
  title: "thirdweb TypeScript SDK",
});
