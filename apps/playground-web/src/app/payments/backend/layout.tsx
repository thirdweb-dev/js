import type React from "react";
import { PageHeader } from "../../../components/blocks/APIHeader";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div>
      <PageHeader
        description={
          <>HTTP API to bridge, swap and onramp to and from any currency</>
        }
        docsLink="https://portal.thirdweb.com/payments?utm_source=playground"
        title="Payments API"
      />

      {props.children}
    </div>
  );
}
