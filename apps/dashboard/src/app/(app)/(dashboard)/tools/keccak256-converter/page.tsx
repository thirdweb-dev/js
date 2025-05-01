import type { Metadata } from "next";
import { Keccak256Converter } from "./components/Keccak256Converter";

export const metadata: Metadata = {
  title: "thirdweb Keccak256 Converter",
  description: "Convert a string to a Keccak-256 hash.",
};

export default async function Page() {
  return <Keccak256Converter />;
}
