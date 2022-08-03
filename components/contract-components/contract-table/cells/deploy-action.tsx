import { ens, useContractPublishMetadataFromURI } from "../../hooks";
import {
  ContractCellContext,
  DeployableContractContractCellProps,
} from "../../types";
import { ButtonGroup, Icon, Tooltip } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { isContractIdBuiltInContract } from "components/contract-components/utils";
import { BuiltinContractMap } from "constants/mappings";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { BsShieldFillCheck } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";
import { LinkButton, TrackedIconButton } from "tw-components";

export const ContractDeployActionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value }, context }) => {
  const publishMetadata = useContractPublishMetadataFromURI(value);
  const address = useAddress();
  const ensQuery = ens.useQuery(address);
  const wallet = useSingleQueryParam("networkOrAddress");

  const { trackEvent } = useTrack();

  const audit =
    BuiltinContractMap[value as keyof typeof BuiltinContractMap]?.audit;

  return (
    <>
      <ButtonGroup size="sm">
        {audit && (
          <Tooltip label="Audited Contract" borderRadius="lg" placement="top">
            <TrackedIconButton
              as={LinkButton}
              noIcon
              isExternal
              href={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL}/${audit}`}
              category="deploy"
              label="audited"
              aria-label="Audited contract"
              colorScheme="green"
              variant="outline"
              borderWidth="2px"
              icon={<Icon as={BsShieldFillCheck} boxSize={4} />}
              onClick={() =>
                trackEvent({
                  category: "visit-audit",
                  action: "click",
                  label: value,
                })
              }
            />
          </Tooltip>
        )}
        {isContractIdBuiltInContract(value) ? (
          <LinkButton
            isDisabled={publishMetadata.data?.deployDisabled}
            href={
              BuiltinContractMap[value as keyof typeof BuiltinContractMap]?.href
            }
            isLoading={publishMetadata.isLoading}
            colorScheme="purple"
            variant={publishMetadata.data?.deployDisabled ? "outline" : "solid"}
            rightIcon={
              !publishMetadata.data?.deployDisabled ? (
                <Icon as={FiArrowRight} />
              ) : undefined
            }
          >
            {publishMetadata.data?.deployDisabled ? "Coming Soon" : "Details"}
          </LinkButton>
        ) : (
          <LinkButton
            isDisabled={publishMetadata.data?.deployDisabled}
            isLoading={publishMetadata.isLoading}
            colorScheme="purple"
            rightIcon={<Icon as={FiArrowRight} />}
            href={actionUrlPath(
              context,
              value,
              wallet || ensQuery.data?.ensName || address,
              publishMetadata.data?.name,
            )}
          >
            {context === "create_release"
              ? "Release"
              : context === "view_release"
              ? "Details"
              : "Deploy"}
          </LinkButton>
        )}
      </ButtonGroup>
    </>
  );
};

function actionUrlPath(
  context: ContractCellContext | undefined,
  hash: string,
  address?: string,
  name?: string,
) {
  switch (context) {
    case "view_release":
      return `/${address}/${name}`;
    case "create_release":
      return `/contracts/release/${encodeURIComponent(hash)}`;
    case "deploy":
      return `/contracts/deploy/${encodeURIComponent(hash)}`;
    default:
      // should never happen
      return `/contracts/deploy/${encodeURIComponent(hash)}`;
  }
}
