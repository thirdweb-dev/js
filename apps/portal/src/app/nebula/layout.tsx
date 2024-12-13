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
  title: "Nebula",
  description:
    "Discover Nebula, the ultimate AI solution for seamless blockchain interaction, featuring real-time access to EVM chains and comprehensive on-chain data insights.",
});
