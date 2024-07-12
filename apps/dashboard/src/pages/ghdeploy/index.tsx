import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { DeployWithGithub } from "components/ghdeploy/deploy-with-github";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { PageId } from "page-id";
import { Heading, Text } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const GithubDeployPage: ThirdwebNextPage = () => {
  return (
    <>
      <Flex direction="column" gap={{ base: 12, md: 16 }}>
        <Flex direction="column" gap={2}>
          <Heading as="h1" size="display.md">
            Deploy with github
          </Heading>
          <Text size="body.xl" maxW="container.md">
            
          </Text>
        </Flex>
        
      </Flex>
    </>
  );
};

GithubDeployPage.getLayout = (page, props) => (
  <AppLayout {...props} noSEOOverride>
    <PublisherSDKContext>{page}</PublisherSDKContext>
    <DeployWithGithub />
  </AppLayout>
);

GithubDeployPage.pageId = PageId.GithubDeploy;

export default GithubDeployPage;
