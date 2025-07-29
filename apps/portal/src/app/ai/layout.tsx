import { createMetadata } from "@doc";
import { BookIcon, ZapIcon } from "lucide-react";
import { DocLayout } from "@/components/Layouts/DocLayout";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      editPageButton={true}
      sideBar={{
        links: [
          {
            name: "MCP Server",
            icon: <ZapIcon />,
            href: "/ai/mcp",
          },
          {
            name: "llms.txt",
            icon: <BookIcon />,
            href: "/ai/llm-txt",
          },
        ],
        name: "AI",
      }}
    >
      <div>{props.children}</div>
    </DocLayout>
  );
}

export const metadata = createMetadata({
  description: "AI tools for agents and LLM clients.",
  title: "thirdweb AI",
});
