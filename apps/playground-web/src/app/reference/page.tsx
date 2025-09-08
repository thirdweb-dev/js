import { ScalarApiReference } from "@/components/blocks/scalar-api/ScalarClient";
import { createMetadata } from "@/lib/metadata";

export default async function ReferencePage() {
  const responses = await fetch("https://api.thirdweb.com/openapi.json");
  const spec = await responses.json();
  return <ScalarApiReference spec={spec} />;
}

export const metadata = createMetadata({
  title: "thirdwebAPI Reference",
  description: "A Unified interface for Web3 development",
});

export const revalidate = 3600;
