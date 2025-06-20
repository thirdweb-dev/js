import { createMetadata } from "@doc";
import { DocLayout } from "@/components/Layouts/DocLayout";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout editPageButton={true} sideBar={sidebar}>
      {props.children}
    </DocLayout>
  );
}

export const metadata = createMetadata({
  description:
    "This Knowledge Base collects concise guides and troubleshooting tips for common web3 development challenges—especially when using thirdweb, but many articles apply to any web3 project.",
  title: "thirdweb Knowledge Base",
});
