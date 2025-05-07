"use client";
import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { THIRDWEB_ENGINE_CLOUD_URL } from "@/constants/env";

export function Scalar() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl tracking-tight">Full API Reference</h2>
      <ApiReferenceReact
        configuration={{
          url: `${THIRDWEB_ENGINE_CLOUD_URL}/openapi`,
          hideModels: true,
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
