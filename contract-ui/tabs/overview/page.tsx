import { AddToDashboardCard } from "./cards/add-to-dashboard";
import { FeedbackFormCard } from "./cards/feedback-form";
import { Flex } from "@chakra-ui/react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { useTrack } from "hooks/analytics/useTrack";
import { Card, Heading, Link } from "tw-components";

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
        <Card w="100%" flexShrink={0}>
          Additional contract overview information is being added. In the
          meantime why not check out{" "}
          <Link href="code" color="primary.500">
            the code tab
          </Link>
          ?
        </Card>
        <AddToDashboardCard contractAddress={contractAddress} />
        {/* we only show the feedback form on custom cotnracts */}
        {contractQuery.data?.contractType === "custom" && (
          <FeedbackFormCard
            trackEvent={trackEvent}
            wallet={address}
            scope="thirdweb-deploy"
            localStorageKey={`tw_deploy-${contractAddress}`}
          />
        )}
      </Flex>
    </Flex>
  );
};
