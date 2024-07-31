import type { Metadata } from "next";
import { UnixTimeConverter } from "./components/UnixTimeConverter";

export const metadata: Metadata = {
  title: "thirdweb Unix Time Converter",
  description: "Convert Unix time to a human-readable time.",
};

export default async function Page() {
  return <UnixTimeConverter />;
}
