import { ReleaserAvatar } from "../releaser/masked-avatar";
import { Flex, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import {
  ens,
  useReleasesFromDeploy,
} from "components/contract-components/hooks";
import { useMemo } from "react";
import { Badge, Card, Heading, Link, Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

interface ReleasedByProps {
  contractAddress: string;
}

export const ReleasedBy: React.FC<ReleasedByProps> = ({ contractAddress }) => {
  const contractEnsQuery = ens.useQuery(contractAddress);

  const releasesFromDeploy = useReleasesFromDeploy(
    contractEnsQuery.data?.address || undefined,
  );

  const address = useAddress();

  const releaseToShow = useMemo(() => {
    return (
      releasesFromDeploy.data?.find(
        (release) => release.publisher === address,
      ) ||
      releasesFromDeploy.data?.at(-1) ||
      undefined
    );
  }, [releasesFromDeploy.data, address]);

  const releaserEnsQuery = ens.useQuery(releaseToShow?.publisher);
  const releaserAddress =
    releaserEnsQuery.data?.ensName || releaserEnsQuery.data?.address;

  if (!releaseToShow || !releaserAddress) {
    return null;
  }

  const releaseUrl = `/contracts/${releaserAddress}/${releaseToShow?.name}/${releaseToShow?.version}`;
  return (
    <Card
      w={{ base: "100%", md: "330px" }}
      bg="backgroundCardHighlight"
      as={LinkBox}
    >
      <Flex gap={2} direction="column">
        <Flex gap={0.5} direction="column">
          <Flex justify="space-between" gap={4} align="center">
            <LinkOverlay as={Link} href={releaseUrl} noMatch>
              <Heading noOfLines={1} size="label.lg">
                {releaseToShow.name}
              </Heading>
            </LinkOverlay>
            <Badge flexShrink={0} borderRadius="sm" textTransform="lowercase">
              v{releaseToShow.version}
            </Badge>
          </Flex>
          {releaseToShow.description && (
            <Text noOfLines={2} size="body.sm">
              {releaseToShow.description}
            </Text>
          )}
        </Flex>

        <Link
          noMatch
          display="flex"
          alignItems="center"
          gap={1}
          href={`/${releaserAddress}`}
        >
          <ReleaserAvatar address={releaserAddress} boxSize={6} />
          <Text size="label.md">{shortenIfAddress(releaserAddress, true)}</Text>
        </Link>
      </Flex>
    </Card>
  );
};
