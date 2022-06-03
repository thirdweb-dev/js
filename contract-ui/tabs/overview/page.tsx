import { AddToDashboardCard } from "./cards/add-to-dashboard";
import { CustomContractCode } from "./cards/custom-contract-code";
import { FeedbackFormCard } from "./cards/feedback-form";
import { Flex } from "@chakra-ui/react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { useTrack } from "hooks/analytics/useTrack";
import { Heading } from "tw-components";

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

export const CustomContractOverviewPage: React.FC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  const address = useAddress();
  const contractQuery = useContract(contractAddress);

  const { trackEvent } = useTrack();

  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }
  if (!contractQuery || contractQuery?.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={4}>
      <Heading size="subtitle.md">Contract Overview</Heading>
      <Flex gap={8} w="100%" flexWrap="wrap">
        <AddToDashboardCard contractAddress={contractAddress} />
        {/* we only show the feedback form on custom contracts */}
        {contractQuery.data?.contractType === "custom" && (
          <FeedbackFormCard
            trackEvent={trackEvent}
            wallet={address}
            scope="thirdweb-deploy"
            localStorageKey={`tw_deploy-${contractAddress}`}
          />
        )}
        <CustomContractCode contractAddress={contractAddress} />
      </Flex>
    </Flex>
  );
};
