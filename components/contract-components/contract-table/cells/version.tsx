import { ens, useContractPrePublishMetadata } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { useAddress } from "@thirdweb-dev/react";
import { BuiltinContractMap } from "constants/mappings";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { Text } from "tw-components";

export const ContractVersionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const address = useAddress();
  const wallet = useSingleQueryParam("networkOrAddress");

  const ensQuery = ens.useQuery(wallet);
  const fullPublishMetadata = useContractPrePublishMetadata(
    value,
    ensQuery.data?.address || wallet || address,
  );

  const isPrebuilt =
    !!BuiltinContractMap[value as keyof typeof BuiltinContractMap];

  return (
    <Text size="body.md">
      {fullPublishMetadata.data?.latestPublishedContractMetadata
        ?.publishedMetadata.version || (isPrebuilt ? "2.0.0" : "First Release")}
    </Text>
  );
};
