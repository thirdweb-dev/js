import { createMetadata } from "@/components/Document";
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
    "Easily create, deploy, and manage smart contracts on any EVM compatible blockchain",
  image: {
    icon: "contract",
    title: "thirdweb contracts",
  },
  title: "thirdweb Contracts",
});
