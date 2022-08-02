import { ContractDeployForm } from ".";
import { ContractId } from "../types";
import { Box, useDisclosure } from "@chakra-ui/react";
import { Button, Drawer } from "tw-components";

interface DeployFormDrawerProps {
  contractId: ContractId;
}

export const DeployFormDrawer: React.FC<DeployFormDrawerProps> = ({
  contractId,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button flexShrink={0} colorScheme="purple" onClick={onOpen}>
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
          <ContractDeployForm contractId={contractId} />
        </Box>
      </Drawer>
    </>
  );
};
