import { ens, useContractPrePublishMetadata } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { Skeleton } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { BuiltinContractMap } from "constants/mappings";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { LinkButton, Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

export const ContractReleasedByCell: React.FC<
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

  const releaser =
    fullPublishMetadata.data?.latestPublishedContractMetadata?.publishedMetadata
      .publisher;

  const releaserEnsQuery = ens.useQuery(releaser);
  return (
    <Skeleton isLoaded={fullPublishMetadata.isSuccess || isPrebuilt}>
      <LinkButton
        href={`/${releaserEnsQuery.data?.ensName || releaser}`}
        variant="outline"
        px={3}
        mr={3}
        pointerEvents={isPrebuilt ? "none" : "auto"}
        fontFamily="mono"
        size="sm"
        width="100%"
      >
        <Text size="body.md">
          {shortenIfAddress(releaserEnsQuery.data?.ensName || releaser, true) ||
            (isPrebuilt ? "thirdweb" : "Unknown")}
        </Text>
      </LinkButton>
    </Skeleton>
  );
};
