import { createMetadata } from "@/components/Document";
import { ScalarApiReference } from "./ScalarClient";

export const metadata = createMetadata({
  image: {
    title: "thirdweb API Reference",
    icon: "thirdweb",
  },
  title: "thirdweb API Reference",
  description: "A Unified interface for Web3 development",
});

export default async function ApiReferencePage() {
  const responses = await fetch("https://api.thirdweb.com/openapi.json");
  const spec = await responses.json();
  return (
    <div className="container max-sm:px-0">
      <ScalarApiReference spec={spec} />
    </div>
  );
}

export const revalidate = 3600;
