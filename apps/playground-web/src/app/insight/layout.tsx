import type React from "react";
import { PageLayout } from "../../components/blocks/APIHeader";

export default function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout
      title="Insight"
      description={
        <>Simple & customizable endpoints for querying rich blockchain data</>
      }
      docsLink="https://portal.thirdweb.com/insight?utm_source=playground"
      containerClassName="pb-16"
    >
      {props.children}
    </PageLayout>
  );
}
