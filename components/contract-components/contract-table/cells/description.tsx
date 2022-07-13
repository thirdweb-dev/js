import {
  useContractPrePublishMetadata,
  useContractPublishMetadataFromURI,
} from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { Skeleton } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { Text } from "tw-components";

export const ContractDescriptionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const compilerMeta = useContractPublishMetadataFromURI(value);
  const address = useAddress();
  const publishMeta = useContractPrePublishMetadata(value, address);
  const description =
    publishMeta.data?.latestPublishedContractMetadata?.publishedMetadata
      ?.description ||
    compilerMeta.data?.description ||
    "None";

  return (
    <Skeleton isLoaded={compilerMeta.isSuccess}>
      <Text size="body.md" noOfLines={1}>
        {description}
      </Text>
    </Skeleton>
  );
};
