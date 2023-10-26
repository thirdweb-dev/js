import { Box, DarkMode } from "@chakra-ui/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import "swagger-ui-react/swagger-ui.css";
import dynamic from "next/dynamic";
import { useApiAuthToken } from "@3rdweb-sdk/react/hooks/useApi";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

interface EngineExplorerProps {
  instance: string;
}

export const EngineExplorer: React.FC<EngineExplorerProps> = ({ instance }) => {
  const { token } = useApiAuthToken();
  return (
    <ClientOnly ssr={null}>
      <DarkMode>
        <Box bg="backgroundDark" borderRadius="xl">
          <SwaggerUI
            url={`${instance}${instance.endsWith("/") ? "" : "/"}json`}
            docExpansion="none"
            persistAuthorization={true}
            requestInterceptor={(req) => {
              req.headers["Authorization"] = `Bearer ${token}`;
              return req;
            }}
          />
        </Box>
      </DarkMode>
    </ClientOnly>
  );
};
