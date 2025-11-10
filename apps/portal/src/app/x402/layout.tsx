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
    "Instant payments for your APIs, websites, and autonomous agents. x402 is an open-source protocol that turns the HTTP 402 status code into a fully-featured, on-chain payment layer.",
  image: {
    icon: "payments",
    title: "x402 Payments Docs",
  },
  title: "x402 Payments Documentation",
});
