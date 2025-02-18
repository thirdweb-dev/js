import type React from "react";
import { APIHeader } from "../../components/blocks/APIHeader";

export default function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <APIHeader
        title="Insight"
        description={
          <>Simple & customizable endpoints for querying rich blockchain data</>
        }
        docsLink="https://portal.thirdweb.com/insight"
        heroLink="/insight-hero.avif"
      />

      {props.children}
    </div>
  );
}
