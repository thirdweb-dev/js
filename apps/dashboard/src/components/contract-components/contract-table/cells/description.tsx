import { Skeleton } from "@chakra-ui/react";
import { useFetchDeployMetadata } from "components/contract-components/hooks";
import type { DeployableContractContractCellProps } from "components/contract-components/types";

import { Text } from "tw-components";

export const ContractDescriptionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const deployMetadataResultQuery = useFetchDeployMetadata(value);

  return (
    <Skeleton
      isLoaded={
        deployMetadataResultQuery.isSuccess ||
        !deployMetadataResultQuery.isFetching
      }
    >
      <Text size="body.md" noOfLines={1}>
        {deployMetadataResultQuery.data?.latestPublishedContractMetadata
          ?.publishedMetadata.description ||
          (!deployMetadataResultQuery.isFetching ? "First Version" : "None")}
      </Text>
    </Skeleton>
  );
};
