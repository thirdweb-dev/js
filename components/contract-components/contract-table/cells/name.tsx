import { useContractPublishMetadataFromURI } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { Skeleton } from "@chakra-ui/react";
import { Text } from "tw-components";

export const ContractNameCell: React.VFC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const publishMetadata = useContractPublishMetadataFromURI(value);

  return (
    <Skeleton isLoaded={publishMetadata.isSuccess}>
      <Text size="label.md">{publishMetadata.data?.name}</Text>
    </Skeleton>
  );
};
