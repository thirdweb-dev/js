import { DocLayout } from "@/components/Layouts/DocLayout";
import { createMetadata } from "@doc";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout sideBar={sidebar} editPageButton={true}>
      {props.children}
    </DocLayout>
  );
}

export const metadata = createMetadata({
  title: "thirdweb Knowledge Base",

  description:
    "This Knowledge Base collects concise guides and troubleshooting tips for common web3 development challenges—especially when using thirdweb, but many articles apply to any web3 project.",
});
