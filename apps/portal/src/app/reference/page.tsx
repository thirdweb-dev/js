import { createMetadata } from "@/components/Document";
import ModernApiReference from "./ModernApiReference";

export const metadata = createMetadata({
  image: {
    title: "API Reference",
    icon: "thirdweb",
  },
  title: "thirdweb API Reference",
  description: "Complete REST API reference for all thirdweb services",
});

export default function ApiReferencePage() {
  return <ModernApiReference />;
}
