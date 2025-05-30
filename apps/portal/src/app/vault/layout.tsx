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
  title: "Vault",
  description:
    "Vault is an open-source non-custodial key management service, secured with TEE architecture (AWS Nitro Enclaves) and designed for blockchain applications.",
});
