import { useGas } from "@3rdweb-sdk/react/hooks/useGas";
import {
  Badge,
  Flex,
  Heading,
  SimpleGrid,
  Switch,
  Text,
} from "@chakra-ui/react";
import {
  Edition,
  EditionDrop,
  Marketplace,
  NFTCollection,
  NFTDrop,
  Split,
  Token,
  Vote,
} from "@thirdweb-dev/sdk";
import { AppLayout } from "components/app-layouts/app";
import { GasEstimatorBox } from "components/gas-estimator/GasEstimatorBox";
import { Card } from "components/layout/Card";
import { useTrack } from "hooks/analytics/useTrack";
import { NextSeo } from "next-seo";
import { ConsolePage } from "pages/_app";
import { useState } from "react";

const GasPage: ConsolePage = () => {
  const [ethOrUsd, setEthOrUsd] = useState<"eth" | "usd">("eth");
  const { data } = useGas();
  const { Track, trackEvent } = useTrack({
    page: "gas-estimator",
  });

  return (
    <Track>
      <NextSeo
        title="Gas Estimator"
        description="Estimate the cost on deploying contracts or doing common operations on thirdweb on the Ethereum network."
        openGraph={{
          title: "Gas Estimator | thirdweb",
          url: `https://thirdweb.com/gas`,
        }}
      />
      <Flex mb={4}>
        <Heading mr={3}>Gas Estimator</Heading>
        <Flex justifyContent="center" alignItems="center">
          <Badge
            size="lg"
            colorScheme="green"
            borderRadius="lg"
            px={1}
            py={0.5}
            mr={3}
          >
            Ethereum
          </Badge>
          <Heading size="subtitle.sm">ETH</Heading>
          <Switch
            mx={1.5}
            onChange={() => {
              setEthOrUsd(ethOrUsd === "eth" ? "usd" : "eth");
              trackEvent({
                category: "gas-estimator",
                action: "click",
                label: "switch-currency",
              });
            }}
          />
          <Heading size="subtitle.sm">USD</Heading>
        </Flex>
      </Flex>
      <SimpleGrid as={Card} p={0} columns={{ base: 1, md: 4 }}>
        <GasEstimatorBox
          contractType={NFTDrop.contractType}
          ethOrUsd={ethOrUsd}
          data={data}
          borderTopLeftRadius="xl"
          borderTopRightRadius={{ base: "xl", md: "0" }}
        />
        <GasEstimatorBox
          contractType={EditionDrop.contractType}
          ethOrUsd={ethOrUsd}
          data={data}
        />
        <GasEstimatorBox
          contractType={NFTCollection.contractType}
          ethOrUsd={ethOrUsd}
          data={data}
        />
        <GasEstimatorBox
          contractType={Edition.contractType}
          ethOrUsd={ethOrUsd}
          data={data}
          borderTopRightRadius={{ base: "0", md: "xl" }}
        />
        <GasEstimatorBox
          contractType={Token.contractType}
          ethOrUsd={ethOrUsd}
          data={data}
          borderBottomLeftRadius={{ base: "0", md: "xl" }}
        />
        <GasEstimatorBox
          contractType={Split.contractType}
          ethOrUsd={ethOrUsd}
          data={data}
        />
        <GasEstimatorBox
          contractType={Marketplace.contractType}
          ethOrUsd={ethOrUsd}
          data={data}
        />
        <GasEstimatorBox
          contractType={Vote.contractType}
          ethOrUsd={ethOrUsd}
          data={data}
          borderBottomRightRadius="xl"
          borderBottomLeftRadius={{ base: "xl", md: "0" }}
        />
      </SimpleGrid>
      <Text mt={4} textAlign="center">
        Estimates calculated at {data?.gasPrice} gwei and the ETH price of $
        {data?.ethPrice}. These estimates are only intended to use for contracts
        deployed with thirdweb. Updated every 10 seconds.
      </Text>
    </Track>
  );
};

GasPage.Layout = AppLayout;

export default GasPage;
