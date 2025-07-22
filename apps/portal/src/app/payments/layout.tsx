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
    "Monetize your app with thirdweb Payments. Sell products, transfer funds between users, launch tokens, and more.",
  image: {
    icon: "payments",
    title: "thirdweb Payments Docs",
  },
  title: "thirdweb Payments Documentation",
});
