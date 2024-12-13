import type { Metadata } from "next";

const title =
  "thirdweb Nebula: The Most powerful AI for interacting with the blockchain";
const description =
  "The most powerful AI for interacting with the blockchain, with real-time access to EVM chains and their data";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function Layout(props: {
  children: React.ReactNode;
}) {
  return props.children;
}
