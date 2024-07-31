import type { GasEstimate } from "@3rdweb-sdk/react/hooks/useGas";
import { Box, type BoxProps, Flex, Icon, Tooltip } from "@chakra-ui/react";
import { AiOutlineInfoCircle } from "@react-icons/all-files/ai/AiOutlineInfoCircle";
import { utils } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { FiExternalLink } from "react-icons/fi";
import { Heading, Link, Text } from "tw-components";
import { contractSlugMapping } from "./contractSlugMapping";
import { functionNameMapping } from "./functionNameMapping";

interface GasEstimatorBoxProps extends BoxProps {
  ethOrUsd: "eth" | "usd";
  data: BenchmarkItem;
  gasEstimate?: GasEstimate;
}

export type BenchmarkItem = {
  contractName: string;
  benchmarks: Array<{
    functionName: string;
    gasCost: string;
  }>;
};

export const GasEstimatorBox: React.FC<GasEstimatorBoxProps> = ({
  data,
  ethOrUsd,
  gasEstimate,
  ...props
}) => {
  const formatPrice = (price: number | undefined) => {
    if (price && ethOrUsd === "eth") {
      return `~${Number(
        utils.formatUnits(
          `${((gasEstimate?.gasPrice as number) || 30) * price}`,
          "gwei",
        ),
      ).toFixed(4)} ETH`;
    }
    if (price && ethOrUsd === "usd") {
      return `~$${(
        Number(
          utils.formatUnits(
            `${((gasEstimate?.gasPrice as number) || 30) * price}`,
            "gwei",
          ),
        ) * (gasEstimate?.ethPrice || 3400)
      ).toFixed(2)}`;
    }
  };
  const trackEvent = useTrack();
  const contractSlug = contractSlugMapping[data.contractName];
  const tooltipContent = functionNameMapping[data.contractName] || {};
  const externalLink = contractSlug
    ? `https://portal.thirdweb.com/contracts/explore/pre-built-contracts/${contractSlug}`
    : "https://portal.thirdweb.com/contracts/explore/overview";
  return (
    <Box p={6} border="1px solid" borderColor="borderColor" {...props}>
      <Link
        href={externalLink}
        onClick={() =>
          trackEvent({
            category: "gas-estimator",
            action: "click",
            label: "portal-link",
            contractType: data.contractName,
          })
        }
        isExternal
      >
        <Heading size="title.sm" mb={1} mr={1} as={Flex} alignItems="center">
          {beautifyContractName(data.contractName)}
          <Icon as={FiExternalLink} ml={1} boxSize={4} />
        </Heading>
      </Link>
      {data.benchmarks.map((item) => (
        <Flex justifyContent="space-between" key={item.functionName}>
          <Tooltip
            label={tooltipContent[item.functionName] || item.functionName}
          >
            <Flex justifyContent="center" alignItems="center">
              <Text noOfLines={1} maxW={"150px"} mr={1}>
                {item.functionName}
              </Text>
              <Icon as={AiOutlineInfoCircle} boxSize={4} />
            </Flex>
          </Tooltip>
          <Text>{formatPrice(Number(item.gasCost))}</Text>
        </Flex>
      ))}
    </Box>
  );
};

const beautifyContractName = (contractName: string): string => {
  return contractName.charAt(0).toUpperCase() + contractName.slice(1);
};
