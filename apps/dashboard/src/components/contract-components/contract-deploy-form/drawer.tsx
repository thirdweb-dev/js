import { Box, Flex, Icon, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { BiRocket } from "react-icons/bi";
import { FiChevronsRight } from "react-icons/fi";
import { Button, Drawer } from "tw-components";
import { ContractDeployForm } from ".";
import type { ContractId } from "../types";

interface DeployFormDrawerProps {
  contractId: ContractId;
  version?: string;
  chainId?: number;
  onSuccessCallback?: (contractAddress: string) => void;
  onDrawerVisibilityChanged?: (isVisible: boolean) => void;
  isImplementationDeploy?: true;
  onlyIcon?: boolean;
}

export const DeployFormDrawer: React.FC<DeployFormDrawerProps> = ({
  contractId,
  version,
  chainId,
  onSuccessCallback,
  onDrawerVisibilityChanged,
  isImplementationDeploy,
  onlyIcon = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const trackEvent = useTrack();
  return (
    <>
      <Button
        flexShrink={0}
        colorScheme="primary"
        onClick={() => {
          trackEvent({
            category: "specific-release",
            action: "click",
            label: "open-drawer",
          });
          onOpen();
          onDrawerVisibilityChanged?.(true);
        }}
        rightIcon={onlyIcon ? undefined : <Icon as={FiChevronsRight} />}
      >
        {onlyIcon ? (
          <Tooltip
            p={0}
            ml={3}
            label={<Flex p={2}>Deploy</Flex>}
            bgColor="backgroundHighlight"
            borderRadius="lg"
            placement="right"
            shouldWrapChildren
          >
            <Icon as={BiRocket} />
          </Tooltip>
        ) : (
          "Deploy now"
        )}
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
        trapFocus={false}
        blockScrollOnMount={false}
      >
        <Box py={4} px={2}>
          <ContractDeployForm
            isImplementationDeploy={isImplementationDeploy}
            contractId={contractId}
            version={version}
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
