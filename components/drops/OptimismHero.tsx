import { useContractList } from "@3rdweb-sdk/react";
import { Box, Flex } from "@chakra-ui/react";
import { OptimismGoerli } from "@thirdweb-dev/chains";
import {
  useAddress,
  useBalance,
  Web3Button,
  useChainId,
} from "@thirdweb-dev/react";
import { StepsCard } from "components/dashboard/StepsCard";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { BigNumber } from "ethers";
import { getDashboardChainRpc } from "lib/rpc";
import { LinkButton, Heading } from "tw-components";
import { DropsOptimismSDK } from "pages/drops/optimism";
import { ClaimNFT } from "./ClaimNFT";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DeployContractCheck } from "./DeployContractCheck";

export const OptimismHero = () => {
  const step2CompletedRef = useRef(false);
  const [hasDeployed, setHasDeployed] = useState(false);
  const address = useAddress();
  const balance = useBalance();

  const chainId = useChainId();

  const optimismGoerliQuery = useContractList(
    OptimismGoerli.chainId,
    getDashboardChainRpc(OptimismGoerli),
    address,
  );

  const step2Completed =
    chainId === OptimismGoerli.chainId &&
    BigNumber.from(balance.data?.value || 0).gt(0);

  useEffect(() => {
    if ((optimismGoerliQuery?.data || [])?.length > 0) {
      setHasDeployed(true);
    }
  }, [optimismGoerliQuery.data]);

  useEffect(() => {
    if (address) {
      step2CompletedRef.current = false;
      setHasDeployed(false);
    }
  }, [address]);

  const steps = [
    {
      title: "Connect your wallet to OP Goerli",
      description: "Connect your wallet to see your eligibility.",
      completed:
        chainId === OptimismGoerli.chainId || step2CompletedRef.current,
      children: (
        <Web3Button
          // This is just a random op goerli contract address to trigger the network switch
          contractAddress="0x514A85Bcf5ce1a3735Fdb7F2f30B9fC757bf295C"
          action={() => null}
        >
          Switch Network
        </Web3Button>
      ),
    },
    {
      title: "Get funds",
      description: "Claim testnet funds from the Superchain faucet.",
      completed:
        (chainId === OptimismGoerli.chainId &&
          BigNumber.from(balance.data?.value || 0).gt(0)) ||
        step2CompletedRef.current,
      children: (
        <LinkButton
          href="https://app.optimism.io/faucet"
          isExternal
          color="bgWhite"
          bgColor="bgBlack"
          _hover={{
            opacity: 0.8,
          }}
        >
          Visit Faucet
        </LinkButton>
      ),
    },
    {
      title: "Deploy a contract",
      description: "Deploy a smart contract on OP Goerli",
      completed: hasDeployed,
      children: <DeployContractCheck setHasDeployed={setHasDeployed} />,
    },
    {
      title: "Mint your NFT on OP Mainnet",
      description: "This action is free.",
      completed: false,
      children: (
        <DropsOptimismSDK chainId={10}>
          <ClaimNFT />
        </DropsOptimismSDK>
      ),
    },
  ];

  useEffect(() => {
    if (step2Completed) {
      step2CompletedRef.current = true;
    }
  }, [step2Completed]);

  return (
    <HomepageSection mt={16}>
      <Flex flexDir="column" gap={12} w={{ base: "100%", md: "70%" }} mx="auto">
        <Flex flexDir="column" gap={4} textAlign="center" w="full">
          <Box mx="auto" w={40}>
            <Image src={require("public/assets/drops/optimism.png")} alt="" />
          </Box>
          <Heading size="display.sm">
            <Box
              as="span"
              bgGradient="linear(to-r, #FF0520, #F06C7A)"
              bgClip="text"
            >
              Claim a free NFT
            </Box>{" "}
            for building on the Superchain.
          </Heading>
        </Flex>
        <StepsCard title="" steps={steps} delay={0} />
      </Flex>
    </HomepageSection>
  );
};
