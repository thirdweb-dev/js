"use client";

import { ClientOnly } from "components/ClientOnly/ClientOnly";
import "./swagger-ui.css";
import "swagger-ui-react/swagger-ui.css";
import dynamic from "next/dynamic";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

interface EngineExplorerProps {
  instanceUrl: string;
  authToken: string;
}

export const EngineExplorer: React.FC<EngineExplorerProps> = ({
  instanceUrl,
  authToken,
}) => {
  return (
    <ClientOnly ssr={null}>
      <div className="dark rounded-lg border border-border bg-background py-10 pt-4">
        <SwaggerUI
          url={`${instanceUrl}${instanceUrl.endsWith("/") ? "" : "/"}json`}
          docExpansion="none"
          persistAuthorization={true}
          requestInterceptor={(req) => {
            req.headers.Authorization = `Bearer ${authToken}`;
            // This is required to skip the browser warning when using ngrok
            // else, Engine -> Explorer doesn't work
            // more info: https://ngrok.com/abuse
            req.headers["ngrok-skip-browser-warning"] = "true";
            return req;
          }}
        />
      </div>
    </ClientOnly>
  );
};
