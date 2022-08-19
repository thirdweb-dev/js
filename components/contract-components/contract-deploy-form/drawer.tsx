import { ContractDeployForm } from ".";
import { ContractId } from "../types";
import { Box, useDisclosure } from "@chakra-ui/react";
import { SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { useTrack } from "hooks/analytics/useTrack";
import { Button, Drawer } from "tw-components";

interface DeployFormDrawerProps {
  contractId: ContractId;
  chainId?: SUPPORTED_CHAIN_ID;
  onSuccessCallback?: (contractAddress: string) => void;
  onDrawerVisibilityChanged?: (isVisible: boolean) => void;
}

export const DeployFormDrawer: React.FC<DeployFormDrawerProps> = ({
  contractId,
  chainId,
  onSuccessCallback,
  onDrawerVisibilityChanged,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const trackEvent = useTrack();
  return (
    <>
      <Button
        flexShrink={0}
        colorScheme="purple"
        onClick={() => {
          trackEvent({
            category: "specific-release",
            action: "click",
            label: "open-drawer",
          });
          onOpen();
          onDrawerVisibilityChanged?.(true);
        }}
      >
        Deploy Now
      </Button>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={() => {
          onDrawerVisibilityChanged?.(false);
          onClose();
        }}
        onCloseComplete={() => {
          onDrawerVisibilityChanged?.(false);
        }}
        isOpen={isOpen}
      >
        <Box py={4} px={2}>
          <ContractDeployForm
            contractId={contractId}
            chainId={chainId}
            onSuccessCallback={
              onSuccessCallback
                ? (address) => {
                    onSuccessCallback(address);
                    onDrawerVisibilityChanged?.(false);
                    onClose();
                  }
                : undefined
            }
          />
        </Box>
      </Drawer>
    </>
  );
};
