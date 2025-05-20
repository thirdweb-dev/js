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
  title: "thirdweb Universal Bridge Documentation",
  image: {
    title: "thirdweb Universal Bridge Docs",
    icon: "nebula",
  },
  description:
    "thirdweb Universal Bridge documentation. Learn how to use the thirdweb Universal Bridge to send and receive tokens across different blockchains.",
});
