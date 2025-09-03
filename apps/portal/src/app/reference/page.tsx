import { createMetadata } from "@/components/Document";
import { ScalarApiReference } from "./ScalarClient";

export const metadata = createMetadata({
  image: {
    title: "API Reference",
    icon: "thirdweb",
  },
  title: "thirdweb API Reference",
  description: "Complete REST API reference for all thirdweb services",
});

export default function ApiReferencePage() {
  return (
    <div className="container max-sm:px-0">
      <ScalarApiReference />
    </div>
  );
}
