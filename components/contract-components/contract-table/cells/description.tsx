import { useContractPrePublishMetadata, useResolvedEnsName } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { Skeleton } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { BuiltinContractMap } from "constants/mappings";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { Text } from "tw-components";

export const ContractDescriptionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const address = useAddress();
  const wallet = useSingleQueryParam("networkOrAddress");

  const resolvedAddress = useResolvedEnsName(wallet);

  const fullPublishMetadata = useContractPrePublishMetadata(
    value,
    resolvedAddress.data || wallet || address,
  );

  const description =
    BuiltinContractMap[value as keyof typeof BuiltinContractMap]?.description;

  return (
    <Skeleton isLoaded={fullPublishMetadata.isSuccess || !!description}>
      <Text size="body.md" noOfLines={1}>
        {fullPublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata.description ||
          description ||
          "None"}
      </Text>
    </Skeleton>
  );
};
