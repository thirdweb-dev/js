import { Box, DarkMode } from "@chakra-ui/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import "../../../css/swagger-ui.css";
import "swagger-ui-react/swagger-ui.css";
import dynamic from "next/dynamic";
import { useAccessToken } from "../../../@3rdweb-sdk/react/components/connect-wallet/useAccessToken";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

interface EngineExplorerProps {
  instanceUrl: string;
}

export const EngineExplorer: React.FC<EngineExplorerProps> = ({
  instanceUrl,
}) => {
  const token = useAccessToken();
  return (
    <ClientOnly ssr={null}>
      <DarkMode>
        <Box bg="backgroundDark" borderRadius="xl">
          <SwaggerUI
            url={`${instanceUrl}${instanceUrl.endsWith("/") ? "" : "/"}json`}
            docExpansion="none"
            persistAuthorization={true}
            requestInterceptor={(req) => {
              req.headers.Authorization = `Bearer ${token}`;
              // This is required to skip the browser warning when using ngrok
              // else, Engine -> Explorer doesn't work
              // more info: https://ngrok.com/abuse
              req.headers["ngrok-skip-browser-warning"] = "true";
              return req;
            }}
          />
        </Box>
      </DarkMode>
    </ClientOnly>
  );
};
