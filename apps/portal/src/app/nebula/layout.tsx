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
    "thirdweb Nebula Docs : explore the Nebula API Reference and unlock the most powerful AI to interact with the blockchain yet.",
  image: {
    icon: "nebula",
    title: "Nebula Docs",
  },
  title: "thirdweb Nebula Documentation",
});
