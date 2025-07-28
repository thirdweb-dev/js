"use client";
import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import {
  NEXT_PUBLIC_ENGINE_CLOUD_URL,
  NEXT_PUBLIC_THIRDWEB_API_HOST,
} from "@/constants/public-envs";

interface ScalarProps {
  useEngineAPI: boolean;
}

export function Scalar({ useEngineAPI }: ScalarProps) {
  const apiUrl = useEngineAPI
    ? NEXT_PUBLIC_ENGINE_CLOUD_URL
    : NEXT_PUBLIC_THIRDWEB_API_HOST;
  const openApiUrl = useEngineAPI
    ? `${apiUrl}/openapi`
    : `${apiUrl}/openapi.json`;
  const apiName = useEngineAPI ? "Engine API (advanced)" : "thirdweb API";
  const serverDescription = useEngineAPI ? "Engine Cloud" : "thirdweb API";

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl tracking-tight">
        Full API Reference - {apiName}
      </h2>
      <ApiReferenceReact
        configuration={{
          hideModels: true,
          servers: [
            {
              description: serverDescription,
              url: apiUrl,
            },
          ],
          url: openApiUrl,
        }}
      />
    </div>
  );
}
