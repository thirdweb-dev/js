import type { Metadata } from "next";
import { WeiConverter } from "./components/WeiConverter";

export const metadata: Metadata = {
  description: "Convert between wei, gwei, and ether units.",
  title: "thirdweb Wei / Gwei / Ether Converter",
};

export default async function Page() {
  return <WeiConverter />;
}
