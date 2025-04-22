"use client";
import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { THIRDWEB_ENGINE_CLOUD_URL } from "@/constants/env";

export default function TransactionsExplorerPage() {
  return (
    <div>
      <ApiReferenceReact
        configuration={{
          url: `${THIRDWEB_ENGINE_CLOUD_URL}/openapi`,
          servers: [
            {
              url: THIRDWEB_ENGINE_CLOUD_URL,
              description: "Engine Cloud",
            },
          ],
        }}
      />
    </div>
  );
}
