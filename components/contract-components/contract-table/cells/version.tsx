import { useContractPrePublishMetadata } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { useAddress } from "@thirdweb-dev/react";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { Text } from "tw-components";

export const ContractVersionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const address = useAddress();
  const wallet = useSingleQueryParam("wallet");
  const fullPublishMetadata = useContractPrePublishMetadata(
    value,
    wallet || address,
  );

  return (
    <Text size="body.md">
      {fullPublishMetadata.data?.latestPublishedContractMetadata
        ?.publishedMetadata.version || "First Release"}
    </Text>
  );
};
