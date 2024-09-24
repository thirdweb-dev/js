import { DocLayout } from "@/components/Layouts/DocLayout";
import { TypeScriptVersionSelector } from "../../../components/others/VersionSelector";
import { typescriptV4Sidebar } from "../../typescript/v4/sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      sideBar={typescriptV4Sidebar}
      editPageButton={true}
      sidebarHeader={<TypeScriptVersionSelector selected="v4" />}
    >
      {props.children}
    </DocLayout>
  );
}
