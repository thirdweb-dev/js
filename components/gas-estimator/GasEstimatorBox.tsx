import { GasEstimate } from "@3rdweb-sdk/react/hooks/useGas";
import { Box, BoxProps, Flex, Icon, Tooltip } from "@chakra-ui/react";
import { AiOutlineInfoCircle } from "@react-icons/all-files/ai/AiOutlineInfoCircle";
import { ContractType } from "@thirdweb-dev/sdk";
import {
  CONTRACT_TYPE_NAME_MAP,
  GasEstimatorMap,
  GasPrice,
} from "constants/mappings";
import { utils } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { FiExternalLink } from "react-icons/fi";
import { Heading, Link, Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface PriceLineProps {
  title: string;
  label: string;
  gasPrice?: number;
}

const PriceLine: ComponentWithChildren<PriceLineProps> = ({
  title,
  label,
  gasPrice,
  children,
}) => {
  return (
    <>
      {gasPrice ? (
        <Flex justifyContent="space-between">
          <Tooltip label={label}>
            <Flex justifyContent="center" alignItems="center">
              <Text mr={1}>{title}:</Text>
              <Icon as={AiOutlineInfoCircle} boxSize={4} />
            </Flex>
          </Tooltip>
          <Text>{children}</Text>
        </Flex>
      ) : null}
    </>
  );
};

interface GasEstimatorBoxProps extends BoxProps {
  contractType: ContractType;
  ethOrUsd: "eth" | "usd";
  data?: GasEstimate;
}

export const GasEstimatorBox: React.FC<GasEstimatorBoxProps> = ({
  contractType,
  ethOrUsd,
  data,
  ...props
}) => {
  const {
    deployContract,
    setClaimPhase,
    batchUpload,
    mint,
    claim,
    claim5,
    distributeFunds,
  }: GasPrice = GasEstimatorMap[contractType];
  const trackEvent = useTrack();

  const formatPrice = (price: number | undefined) => {
    if (price && ethOrUsd === "eth") {
      return `~${Number(
        utils.formatUnits(
          `${((data?.gasPrice as number) || 30) * price}`,
          "gwei",
        ),
      ).toFixed(4)} ETH`;
    } else if (price && ethOrUsd === "usd") {
      return `~$${(
        Number(
          utils.formatUnits(
            `${((data?.gasPrice as number) || 30) * price}`,
            "gwei",
          ),
        ) * (data?.ethPrice || 3400)
      ).toFixed(2)}`;
    }
  };

  return (
    <Box p={6} border="1px solid" borderColor="borderColor" {...props}>
      <Link
        href={`https://portal.thirdweb.com/contracts/explore/pre-built-contracts//${contractType}`}
        onClick={() =>
          trackEvent({
            category: "gas-estimator",
            action: "click",
            label: "portal-link",
            contractType,
          })
        }
        isExternal
      >
        <Heading size="title.sm" mb={1} mr={1} as={Flex} alignItems="center">
          {CONTRACT_TYPE_NAME_MAP[contractType]}
          <Icon as={FiExternalLink} ml={1} boxSize={4} />
        </Heading>
      </Link>
      <PriceLine
        title="Contract creation"
        label="The price to deploy this Smart Contract"
        gasPrice={deployContract}
      >
        {formatPrice(deployContract)}
      </PriceLine>
      <PriceLine
        title="Set Claim Phases"
        label="The price to set the drop claim phases"
        gasPrice={setClaimPhase}
      >
        {formatPrice(setClaimPhase)}
      </PriceLine>
      <PriceLine
        title="Batch Upload"
        label="The price to create the NFTs. This price is the same for any amount of NFTs created"
        gasPrice={batchUpload}
      >
        {formatPrice(batchUpload)}
      </PriceLine>
      <PriceLine
        title="Mint"
        label="The price you pay to mint one NFT"
        gasPrice={mint}
      >
        {formatPrice(mint)}
      </PriceLine>
      <PriceLine
        title="Claim"
        label="The price your audience pays to claim one previously created NFT"
        gasPrice={claim}
      >
        {formatPrice(claim)}
      </PriceLine>
      <PriceLine
        title="Claim 5"
        label="The price your audience pays to claim five previously created NFT"
        gasPrice={claim5}
      >
        {formatPrice(claim5)}
      </PriceLine>
      <PriceLine
        title="Distribute funds"
        label="The price to distribute funds to two different wallets (More wallets, higher price)"
        gasPrice={distributeFunds}
      >
        {formatPrice(distributeFunds)}
      </PriceLine>
    </Box>
  );
};
