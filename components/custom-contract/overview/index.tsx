import { Flex, Link } from "@chakra-ui/react";
import { detectErc721Instance, useContract } from "@thirdweb-dev/react";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Card, Heading, Text } from "tw-components";

const NftOverview = dynamic(() => import("./nft"));

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

export const CustomContractOverviewPage: React.VFC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  const router = useRouter();
  const contractQuery = useContract(contractAddress);

  if (!contractQuery || contractQuery?.isLoading) {
    return <div>Loading...</div>;
  }

  const nftContract = detectErc721Instance(contractQuery?.contract);

  if (nftContract) {
    // nft overview page
    return <NftOverview contract={nftContract} />;
  }
  return (
    <Card as={Flex} flexDirection="column" gap={2}>
      <Heading size="subtitle.md">Smart Contract</Heading>
      <Text>
        Go to the{" "}
        <NextLink
          passHref
          href={{
            pathname: router.pathname,
            query: {
              ...router.query,
              customContract: [contractAddress || "", "code"],
            },
          }}
        >
          <Link fontWeight="bold" colorScheme="primary" color="primary.500">
            Code
          </Link>
        </NextLink>{" "}
        tab to learn how to integrate with the sdk.
      </Text>
    </Card>
  );
};
