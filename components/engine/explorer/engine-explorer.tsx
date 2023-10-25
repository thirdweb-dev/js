import { Box } from "@chakra-ui/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import "swagger-ui-react/swagger-ui.css";
import dynamic from "next/dynamic";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

interface EngineExplorerProps {
  instance: string;
}

export const EngineExplorer: React.FC<EngineExplorerProps> = ({ instance }) => {
  return (
    <ClientOnly ssr={null}>
      <Box bg="white" borderRadius="xl">
        <SwaggerUI
          url={`${instance}${instance.endsWith("/") ? "" : "/"}json`}
        />
      </Box>
    </ClientOnly>
  );
};
