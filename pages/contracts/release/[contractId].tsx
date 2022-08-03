import { Flex, Link } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ContractReleaseForm } from "components/contract-components/contract-release-form";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { ReactElement } from "react";
import { Heading, Text } from "tw-components";

export default function ContractsPublishPage() {
  const { Track } = useTrack({
    page: "publish",
  });

  const contractId = useSingleQueryParam("contractId");

  return (
    <Track>
      <Flex gap={8} direction="column">
        <Flex gap={2} direction="column">
          <Heading size="title.md">Create a Release</Heading>
          <Text fontStyle="normal" maxW="container.lg">
            Releases are recorded on chain, and enable others to deploy this
            contract and track new versions.
            <br /> Unlocks automatic SDKs in all languages, admin dashboards,
            analytics and auto verification.{" "}
            <Link
              color="primary.500"
              isExternal
              href="https://portal.thirdweb.com/release"
            >
              Learn more
            </Link>
          </Text>
        </Flex>
        {contractId && <ContractReleaseForm contractId={contractId} />}
      </Flex>
    </Track>
  );
}

ContractsPublishPage.getLayout = (page: ReactElement) => (
  <AppLayout>
    <PublisherSDKContext>{page}</PublisherSDKContext>
  </AppLayout>
);
