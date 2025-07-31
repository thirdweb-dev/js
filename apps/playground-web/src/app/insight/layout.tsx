import type React from "react";
import { createMetadata } from "@/lib/metadata";
import { PageLayout } from "../../components/blocks/APIHeader";
import { InsightIcon } from "../../icons/InsightIcon";

const title = "Insight";
const description =
  "Simple & customizable endpoints for querying rich blockchain data";

export const metadata = createMetadata({
  title,
  description,
  image: {
    icon: "insight",
    title,
  },
});

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <PageLayout
      icon={InsightIcon}
      containerClassName="pb-16"
      description={description}
      docsLink="https://portal.thirdweb.com/insight?utm_source=playground"
      title={title}
    >
      {props.children}
    </PageLayout>
  );
}
