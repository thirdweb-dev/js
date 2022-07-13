import { useContractPrePublishMetadata } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { useAddress } from "@thirdweb-dev/react";
import { Text } from "tw-components";

export const ContractVersionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const address = useAddress();
  const fullPublishMetadata = useContractPrePublishMetadata(value, address);
  return (
    <Text size="body.md">
      {fullPublishMetadata.data?.latestPublishedContractMetadata
        ?.publishedMetadata?.version || "First Release"}
    </Text>
  );
};
