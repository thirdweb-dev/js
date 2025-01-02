import type { Metadata } from "next";
import { WeiConverter } from "./components/WeiConverter";

export const metadata: Metadata = {
  title: "thirdweb Wei / Gwei / Ether Converter",
  description: "Convert between wei, gwei, and ether units.",
};

export default async function Page() {
  return <WeiConverter />;
}
