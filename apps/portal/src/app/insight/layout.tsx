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
  title: "Insight",
  description: "Query, transform and analyze blockchain data",
  image: {
    title: "Insight",
    icon: "insight",
  },
});
