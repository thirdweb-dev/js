import type React from "react";
import { APIHeader } from "../../../../components/blocks/APIHeader";

export default function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <APIHeader
        title="Universal Bridge API"
        description={
          <>HTTP API to bridge, swap and onramp to and from any currency</>
        }
        docsLink="https://portal.thirdweb.com/connect/pay/overview?utm_source=playground"
        heroLink="/ub.png"
      />

      {props.children}
    </div>
  );
}
