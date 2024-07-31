import { Skeleton } from "@chakra-ui/react";
import { useContractPrePublishMetadata } from "components/contract-components/hooks";
import type { DeployableContractContractCellProps } from "components/contract-components/types";
import { useActiveAccount } from "thirdweb/react";
import { Text } from "tw-components";

export const ContractDescriptionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const address = useActiveAccount()?.address;

  const fullPublishMetadata = useContractPrePublishMetadata(value, address);

  return (
    <Skeleton
      isLoaded={
        fullPublishMetadata.isSuccess || !fullPublishMetadata.isFetching
      }
    >
      <Text size="body.md" noOfLines={1}>
        {fullPublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata.description ||
          (!fullPublishMetadata.isFetching ? "First Version" : "None")}
      </Text>
    </Skeleton>
  );
};
