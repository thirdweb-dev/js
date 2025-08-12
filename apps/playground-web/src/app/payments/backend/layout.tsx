import { BracesIcon } from "lucide-react";
import type React from "react";
import { PageHeader } from "@/components/blocks/APIHeader";
import { createMetadata } from "@/lib/metadata";

const title = "Payments API";
const description =
  "Create customizable components or backend flows with an HTTP API to onramp, swap, and bridge to and from different cryptocurrencies";
const ogDescription =
  "Bridge, swap, and onramp any currency with thirdweb’s Payments REST API. Use simple HTTP requests to integrate from your backend.";

export const metadata = createMetadata({
  description: ogDescription,
  title,
  image: {
    icon: "payments",
    title,
  },
});

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div>
      <PageHeader
        description={description}
        docsLink="https://portal.thirdweb.com/payments?utm_source=playground"
        icon={BracesIcon}
        title={title}
        containerClassName="max-w-[1400px]"
      />

      {props.children}
    </div>
  );
}
