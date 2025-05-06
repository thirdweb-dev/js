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
  title: "Engine V3",
  description:
    "Engine is a backend HTTP server that calls smart contracts using your managed backend wallets.",
});
