import { useContractPublishMetadataFromURI } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { Skeleton } from "@chakra-ui/react";
import { Text } from "tw-components";

export const ContractDescriptionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const publishMetadata = useContractPublishMetadataFromURI(value);

  return (
    <Skeleton isLoaded={publishMetadata.isSuccess}>
      <Text size="body.md">{publishMetadata.data?.description}</Text>
    </Skeleton>
  );
};
