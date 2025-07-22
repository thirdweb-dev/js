import { DocLayout } from "@/components/Layouts/DocLayout";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      editPageButton={true}
      sideBar={{
        name: "Bundler",
        links: []
      }}
    >
      {props.children}
    </DocLayout>
  );
}
