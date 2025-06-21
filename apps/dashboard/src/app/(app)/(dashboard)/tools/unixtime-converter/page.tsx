import type { Metadata } from "next";
import { ClientOnly } from "@/components/blocks/client-only";
import { UnixTimeConverter } from "./components/UnixTimeConverter";

export const metadata: Metadata = {
  description: "Convert Unix time to a human-readable time.",
  title: "thirdweb Unix Time Converter",
};

export default async function Page() {
  return (
    <ClientOnly ssr={null}>
      <UnixTimeConverter />
    </ClientOnly>
  );
}
