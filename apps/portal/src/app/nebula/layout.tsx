import { DocLayout } from "@/components/Layouts/DocLayout";
import { createMetadata } from "@doc";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      sideBar={sidebar}
      editPageButton={true}
      showTableOfContents={false}
    >
      {props.children}
    </DocLayout>
  );
}

export const metadata = createMetadata({
  title: "thirdweb Nebula Documentation",
  description:
    "thirdweb Nebula Docs : explore the Nebula API Reference and unlock the most powerful AI to interact with the blockchain yet.",
});
