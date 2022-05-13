import { useContractPublishMetadataFromURI } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { ButtonGroup, Icon, useDisclosure } from "@chakra-ui/react";
import { ContractDeployForm } from "components/contract-components/contract-deploy-form";
import { isContractIdBuiltInContract } from "components/contract-components/utils";
import { IoRocketOutline } from "react-icons/io5";
import { Button, Drawer, LinkButton } from "tw-components";

export const ContractDeployActionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const publishMetadata = useContractPublishMetadataFromURI(value);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Drawer size="xl" isOpen={isOpen} onClose={onClose}>
        <ContractDeployForm contractId={value} />
      </Drawer>

      <ButtonGroup size="sm">
        {isContractIdBuiltInContract(value) &&
          !publishMetadata.data?.deployDisabled && (
            <LinkButton
              variant="outline"
              isExternal
              href={`https://portal.thirdweb.com/contracts/${value}`}
            >
              Learn more
            </LinkButton>
          )}
        <Button
          isDisabled={publishMetadata.data?.deployDisabled}
          onClick={onOpen}
          isLoading={publishMetadata.isLoading}
          colorScheme="purple"
          variant={publishMetadata.data?.deployDisabled ? "outline" : "solid"}
          rightIcon={
            !publishMetadata.data?.deployDisabled ? (
              <Icon as={IoRocketOutline} />
            ) : undefined
          }
        >
          {publishMetadata.data?.deployDisabled ? "Coming Soon" : "Deploy Now"}
        </Button>
      </ButtonGroup>
    </>
  );
};
