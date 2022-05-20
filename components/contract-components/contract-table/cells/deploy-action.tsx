import { useContractPublishMetadataFromURI } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { ButtonGroup, Icon, Tooltip, useDisclosure } from "@chakra-ui/react";
import { ContractDeployForm } from "components/contract-components/contract-deploy-form";
import { isContractIdBuiltInContract } from "components/contract-components/utils";
import { BsShieldFillCheck } from "react-icons/bs";
import { IoRocketOutline } from "react-icons/io5";
import { Button, Drawer, LinkButton, TrackedIconButton } from "tw-components";

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
        {(value === "nft-drop" || value === "marketplace") && (
          <Tooltip label="Audited Contract" borderRadius="lg" placement="top">
            <TrackedIconButton
              as={LinkButton}
              noIcon
              isExternal
              href={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL}/QmNgNaLwzgMxcx9r6qDvJmTFam6xxUxX7Vp8E99oRt7i74`}
              category="deploy"
              label="audited"
              aria-label="Audited contract"
              icon={<Icon as={BsShieldFillCheck} boxSize={5} />}
            />
          </Tooltip>
        )}
        {isContractIdBuiltInContract(value) &&
          !publishMetadata.data?.deployDisabled && (
            <LinkButton
              variant="outline"
              isExternal
              href={`https://portal.thirdweb.com/pre-built-contracts/${value}`}
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
