import { useGas } from "@3rdweb-sdk/react/hooks/useGas";
import { Flex, SimpleGrid, Switch } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "components/app-layouts/app";
import {
  type BenchmarkItem,
  GasEstimatorBox,
} from "components/gas-estimator/GasEstimatorBox";
import { useTrack } from "hooks/analytics/useTrack";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { useMemo, useState } from "react";
import { Badge, Card, Heading, Text } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

function parseGasBenchMark(content: string): BenchmarkItem[] {
  if (!content) {
    return [];
  }
  const _data: BenchmarkItem[] = [];
  const separator = "test_benchmark_";
  const lines = content
    .split("\n")
    .filter((line) => line.trim() !== "" && line.includes(separator));
  // biome-ignore lint/complexity/noForEach: FIXME
  lines.forEach((line) => {
    const str = line.split(separator)[1];
    const str2 = str.split("(gas:");
    const [contractName, ...functionParts] = str2[0]
      .replace(/[()\s:]/g, "")
      .split("_");
    const functionName = functionParts.join("_");
    const gasCost = str2[1].replace(/[()\s:]/g, "");

    // There are some lines with "weird" result. we'll be filtering them
    if (Number.isNaN(Number(gasCost))) {
      return;
    }
    const index = _data.findIndex((o) => o.contractName === contractName);
    if (index >= 0) {
      _data[index].benchmarks.push({ functionName, gasCost });
    } else {
      _data.push({
        contractName,
        benchmarks: [
          {
            functionName,
            gasCost,
          },
        ],
      });
    }
  });
  return _data;
}

const GasPage: ThirdwebNextPage = () => {
  const [ethOrUsd, setEthOrUsd] = useState<"eth" | "usd">("eth");
  const { data } = useGas();
  const trackEvent = useTrack();
  const gasBenchmark = useQuery(
    ["gas-benchmark-content"],
    async () => {
      const res = await fetch(
        "https://raw.githubusercontent.com/thirdweb-dev/contracts/main/gasreport.txt",
      );
      return res.text() as Promise<string>;
    },
    {
      refetchInterval: 120_000,
    },
  );

  const gasItems = useMemo(
    () => parseGasBenchMark(gasBenchmark.data || ""),
    [gasBenchmark.data],
  );
  return (
    <>
      <NextSeo
        title="Blockchain Gas Estimator"
        description="Estimate the cost of gas fees when deploying contracts or performing common use cases to the blockchain on thirdweb."
        openGraph={{
          title: "Blockchain Gas Estimator",
          url: "https://thirdweb.com/gas",
        }}
      />
      <Flex mb={4}>
        <Heading mr={3} as="h1">
          Gas Estimator
        </Heading>
        <Flex justifyContent="center" alignItems="center">
          <Badge
            size="label.md"
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
      <SimpleGrid as={Card} p={0} columns={{ base: 1, md: 3, lg: 3 }}>
        {gasItems.map((item) => (
          <GasEstimatorBox
            key={item.contractName}
            ethOrUsd={ethOrUsd}
            gasEstimate={data}
            data={item}
          />
        ))}
      </SimpleGrid>
      <Text mt={4} textAlign="center">
        Estimates calculated at {data?.gasPrice} gwei and the ETH price of $
        {data?.ethPrice}. These estimates are only intended to use for contracts
        deployed with thirdweb. Updated every 60 seconds.
      </Text>
    </>
  );
};

GasPage.getLayout = function getLayout(page, props) {
  return <AppLayout {...props}>{page}</AppLayout>;
};

GasPage.pageId = PageId.GasEstimator;

export default GasPage;
