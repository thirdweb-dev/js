import { DocLayout } from "@/components/Layouts/DocLayout";
import { createMetadata } from "@doc";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout sideBar={sidebar} editPageButton={true} noIndex>
      {props.children}
    </DocLayout>
  );
}

export const metadata = createMetadata({
  title: "thirdweb Infrastructure",
  description:
    "All the infrastructure to scale and build production grade web3 applications",
});
