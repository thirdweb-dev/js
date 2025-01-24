import type { Metadata } from "next";
import { ClientOnly } from "../../../../components/ClientOnly/ClientOnly";
import { UnixTimeConverter } from "./components/UnixTimeConverter";

export const metadata: Metadata = {
  title: "thirdweb Unix Time Converter",
  description: "Convert Unix time to a human-readable time.",
};

export default async function Page() {
  return (
    <ClientOnly ssr={null}>
      <UnixTimeConverter />
    </ClientOnly>
  );
}
