import { createMetadata } from "@doc";
import { DocLayout } from "@/components/Layouts/DocLayout";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout editPageButton={true} sideBar={sidebar}>
      <div>{props.children}</div>
    </DocLayout>
  );
}

export const metadata = createMetadata({
  description: "AI tools for apps, agents and LLM clients.",
  title: "thirdweb AI",
});
