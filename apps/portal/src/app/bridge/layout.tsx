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
  description: "Bridge and swap tokens across chains with thirdweb Bridge.",
  image: {
    icon: "payments",
    title: "thirdweb Bridge Docs",
  },
  title: "thirdweb Bridge Documentation",
});
