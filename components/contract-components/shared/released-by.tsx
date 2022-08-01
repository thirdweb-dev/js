import { Flex } from "@chakra-ui/react";
import {
  useEnsName,
  useReleasesFromDeploy,
  useResolvedEnsName,
} from "components/contract-components/hooks";
import { LinkButton, Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

interface ReleasedByProps {
  contractAddress: string;
}

export const ReleasedBy: React.FC<ReleasedByProps> = ({ contractAddress }) => {
  const resolvedAddress = useResolvedEnsName(contractAddress);
  const releasesFromDeploy = useReleasesFromDeploy(
    resolvedAddress.data || undefined,
  );

  const lastRelease = releasesFromDeploy?.data?.length
    ? releasesFromDeploy.data[releasesFromDeploy.data.length - 1]
    : undefined;

  const ensName = useEnsName(lastRelease?.publisher);

  return lastRelease ? (
    <Flex flexDir="column" gap={3}>
      <LinkButton
        href={`/contracts/${lastRelease?.publisher}/${lastRelease?.name}/${lastRelease?.version}`}
        noMatch
        size="sm"
      >
        {lastRelease?.name} | {lastRelease?.version}
      </LinkButton>
      <Text size="label.sm" textAlign="center">
        Released by {shortenIfAddress(ensName.data || lastRelease?.publisher)}
      </Text>
    </Flex>
  ) : null;
};
