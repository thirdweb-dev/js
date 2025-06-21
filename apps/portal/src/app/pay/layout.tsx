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
    "thirdweb Universal Bridge documentation. Learn how to use the thirdweb Universal Bridge to send and receive tokens across different blockchains.",
  image: {
    icon: "nebula",
    title: "thirdweb Universal Bridge Docs",
  },
  title: "thirdweb Universal Bridge Documentation",
});
