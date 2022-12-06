import { Box } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import {
  useEns,
  useReleasesFromDeploy,
} from "components/contract-components/hooks";
import { ContractCard } from "components/explore/contract-card";
import { useMemo } from "react";
import { CardElevationWrapper } from "tw-components";

interface ReleasedByProps {
  contractAddress: string;
}

export const ReleasedBy: React.FC<ReleasedByProps> = ({ contractAddress }) => {
  const contractEnsQuery = useEns(contractAddress);

  const releasesFromDeploy = useReleasesFromDeploy(
    contractEnsQuery.data?.address || undefined,
  );

  const address = useAddress();

  const releaseToShow = useMemo(() => {
    return (
      releasesFromDeploy.data?.find(
        (release) => release.publisher === address,
      ) ||
      releasesFromDeploy.data?.[releasesFromDeploy.data.length - 1] ||
      undefined
    );
  }, [releasesFromDeploy.data, address]);

  const releaserEnsQuery = useEns(releaseToShow?.publisher);
  const releaserAddress =
    releaserEnsQuery.data?.ensName || releaserEnsQuery.data?.address;

  if (!releaseToShow || !releaserAddress) {
    return null;
  }

  return (
    <Box maxW={{ base: "100%", md: "330px" }}>
      <CardElevationWrapper>
        <ContractCard
          contractId={releaseToShow.name}
          publisher={releaserAddress}
          version={releaseToShow.version}
          slim
        />
      </CardElevationWrapper>
    </Box>
  );
};
