import { DocLayout } from "@/components/Layouts/DocLayout";
import { createMetadata } from "@doc";
import { PlatformSelector } from "../../../components/others/PlatformSelector";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      sideBar={sidebar}
      editPageButton={true}
      sidebarHeader={
        <div className="flex-col items-center gap-1">
          <p className="py-5 font-semibold text-foreground text-lg">Connect</p>
          <PlatformSelector selected="React Native" />
        </div>
      }
    >
      <div data-noindex>{props.children}</div>
    </DocLayout>
  );
}

export const metadata = createMetadata({
  title: "thirdweb React Native SDK",
  description:
    "A type-safe library to interact with any EVM-compatible blockchain in React Native applications",
});
