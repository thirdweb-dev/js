import { useContractPrePublishMetadata, useResolvedEnsName } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { Skeleton } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { Text } from "tw-components";

export const ContractDescriptionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const address = useAddress();
  const wallet = useSingleQueryParam("wallet");

  const resolvedAddress = useResolvedEnsName(wallet);

  const fullPublishMetadata = useContractPrePublishMetadata(
    value,
    resolvedAddress.data || wallet || address,
  );

  return (
    <Skeleton isLoaded={fullPublishMetadata.isSuccess}>
      <Text size="body.md" noOfLines={1}>
        {fullPublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata.description || "None"}
      </Text>
    </Skeleton>
  );
};
