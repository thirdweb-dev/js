import { Skeleton } from "@chakra-ui/react";
import { useContractPublishMetadataFromURI } from "components/contract-components/hooks";
import { DeployableContractContractCellProps } from "components/contract-components/types";
import { Text } from "tw-components";

export const ContractNameCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const publishMetadata = useContractPublishMetadataFromURI(value);

  return (
    <Skeleton isLoaded={publishMetadata.isSuccess}>
      <Text size="label.md">{publishMetadata.data?.name}</Text>
    </Skeleton>
  );
};
