import { Skeleton } from "@chakra-ui/react";
import { useFetchDeployMetadata } from "components/contract-components/hooks";
import type { DeployableContractContractCellProps } from "components/contract-components/types";
import { Text } from "tw-components";

export const ContractNameCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const publishMetadata = useFetchDeployMetadata(value);

  return (
    <Skeleton isLoaded={publishMetadata.isSuccess}>
      <Text size="label.md" textAlign="left">
        {publishMetadata.data?.name}
      </Text>
    </Skeleton>
  );
};
