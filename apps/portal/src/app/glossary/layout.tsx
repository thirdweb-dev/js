import { DocLayout } from "@/components/Layouts/DocLayout";
import { GlossaryBreadcrumb } from "./_components/GlossaryBreadcrumb";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout sideBar={sidebar} editPageButton={true}>
      <GlossaryBreadcrumb sidebar={sidebar} />
      {props.children}
    </DocLayout>
  );
}
