import { createMetadata } from "@doc";
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
    "thirdweb Payments documentation. Learn how to use the thirdweb Payments to send and receive tokens across different blockchains.",
  image: {
    icon: "nebula",
    title: "thirdweb Payments Docs",
  },
  title: "thirdweb Payments Documentation",
});
