"use client";
import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { NEXT_PUBLIC_ENGINE_CLOUD_URL } from "@/constants/public-envs";

export function Scalar() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl tracking-tight">Full API Reference</h2>
      <ApiReferenceReact
        configuration={{
          hideModels: true,
          servers: [
            {
              description: "Engine Cloud",
              url: NEXT_PUBLIC_ENGINE_CLOUD_URL,
            },
          ],
          url: `${NEXT_PUBLIC_ENGINE_CLOUD_URL}/openapi`,
        }}
      />
    </div>
  );
}
