import { createMetadata } from "@/components/Document";
import { DocLayout } from "@/components/Layouts/DocLayout";
import { sidebar } from "./sidebar";
export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      editPageButton={true}
      sideBar={sidebar}
      sidebarHeader={
        <div className="flex-col items-center gap-1">
          <p className="py-5 font-semibold text-foreground text-lg">Webhooks</p>
        </div>
      }
    >
      {props.children}
    </DocLayout>
  );
}

export const metadata = createMetadata({
  description: "Receive real-time updates for onchain and offchain events.",
  image: {
    icon: "webhooks",
    title: "Thirdweb Webhooks",
  },
  title: "thirdweb Webhooks",
});
