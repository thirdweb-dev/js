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
    "Easily read, write, deploy, and listen to contract events on any EVM compatible blockchain",
  image: {
    icon: "contract",
    title: "Contracts",
  },
  title: "Contracts",
});

export const revalidate = 86400; // revalidate every day
