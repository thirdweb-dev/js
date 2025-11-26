import { createMetadata } from "@doc";
import { DocLayout } from "@/components/Layouts/DocLayout";
import { PlatformSelector } from "../../../components/others/PlatformSelector";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      editPageButton={true}
      sideBar={sidebar}
      sidebarHeader={<PlatformSelector selected="TypeScript" />}
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

export const revalidate = 86400; // revalidate every day
