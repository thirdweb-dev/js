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
}

export const DeployFormDrawer: React.FC<DeployFormDrawerProps> = ({
  contractId,
  chainId,
  onSuccessCallback,
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
        }}
      >
        Deploy Now
      </Button>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
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
