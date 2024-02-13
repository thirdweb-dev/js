import { BEAR_MARKET_TRACKING_CATEGORY, ContractSearchResult } from ".";
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { ChainIcon } from "components/icons/ChainIcon";
import { useSupportedChain } from "hooks/chains/configureChains";
import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Button, Card, Heading, Text, TrackedLink } from "tw-components";
import { shortenString } from "utils/usedapp-external";

interface ContractsDeployedProps {
  contracts: ContractSearchResult[];
}

interface ListItemProps {
  contract: ContractSearchResult;
}

const ListItem: React.FC<ListItemProps> = ({ contract }) => {
  const { chainId, address } = contract;
  const chain = useSupportedChain(chainId);
  const { colorMode } = useColorMode();

  return (
    <TrackedLink
      href={`/${chain?.slug}/${address}`}
      target="_blank"
      w="full"
      alignSelf="center"
      _hover={{
        textDecoration: "none",
      }}
      role="group"
      category={BEAR_MARKET_TRACKING_CATEGORY}
      label="contracts_deployed"
      trackingProps={{
        contractLabel: "contract_link",
      }}
    >
      <Flex rounded="xl" gap={4} mt={6} justifyContent="space-between" w="full">
        <Flex gap={3}>
          <Flex alignItems="center" h="full">
            <ChainIcon size={36} ipfsSrc={chain?.icon?.url} />
          </Flex>
          <Flex
            flexDir="column"
            _groupHover={{
              opacity: 0.8,
            }}
          >
            <Flex gap={1} justifyContent="center">
              <Text
                fontSize="16px"
                color={colorMode === "dark" ? "white" : "black"}
              >
                {chain?.name}
              </Text>
            </Flex>
            <Text fontSize="16px">
              <Text fontFamily="monospace">{shortenString(address, true)}</Text>
            </Text>
          </Flex>
        </Flex>
        <ChakraNextImage
          _groupHover={{
            opacity: 0.8,
          }}
          cursor="pointer"
          src={require("public/assets/bear-market-airdrop/contract-arr.svg")}
          alt="contract link"
        />
      </Flex>
    </TrackedLink>
  );
};

const perPage = 5;

export const ContractsDeployed: React.FC<ContractsDeployedProps> = ({
  contracts,
}) => {
  const { colorMode } = useColorMode();

  const [currPage, setCurrPage] = useState(1);
  const totalPages = useMemo(() => {
    return Math.ceil(contracts.length / perPage);
  }, [contracts]);

  const paginatedList = useMemo(() => {
    const start = (currPage - 1) * perPage;
    const end = start + perPage;
    return contracts.slice(start, end);
  }, [contracts, currPage]);

  const pageNumbersToShow = [];
  if (currPage <= totalPages - 3) {
    pageNumbersToShow.push(currPage, currPage + 1, currPage + 2);
  } else {
    pageNumbersToShow.push(totalPages - 2, totalPages - 1, totalPages);
  }

  return (
    <Card
      px={{ base: 6, md: 10 }}
      pt={{ base: 6, md: 10 }}
      rounded="xl"
      h={{ base: "auto", md: 561 }}
      w={{ base: "auto", md: 400 }}
      bg="#121018"
      overflow="auto"
      display="flex"
      flexDirection="column"
    >
      <Heading textAlign="center" fontSize="20px">
        Contracts you&apos;ve deployed
      </Heading>
      {contracts.length > 0 ? (
        <>
          <Flex direction="column">
            {paginatedList.map((contract) => (
              <ListItem key={contract.address} contract={contract} />
            ))}
          </Flex>
          {totalPages > 1 && (
            <>
              <Spacer />
              <Flex gap={8} justifyContent="center" alignItems="center">
                <IconButton
                  aria-label="Previous page"
                  bg="transparent"
                  onClick={() => setCurrPage(currPage - 1)}
                  _hover={{ bg: "transparent" }}
                  isDisabled={currPage === 1}
                  icon={<Icon as={FiChevronLeft} />}
                />
                {totalPages <= 5 ? (
                  Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <Button
                        variant="ghost"
                        bg="transparent"
                        key={pageNum}
                        fontWeight={pageNum === currPage ? "bold" : "normal"}
                        onClick={() => setCurrPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    ),
                  )
                ) : (
                  <>
                    {currPage > 1 && (
                      <>
                        <Text onClick={() => setCurrPage(1)} cursor="pointer">
                          1
                        </Text>
                        <Text>...</Text>
                      </>
                    )}
                    {pageNumbersToShow.map((pageNum) => (
                      <Text
                        key={pageNum}
                        fontWeight={pageNum === currPage ? "bold" : "normal"}
                        color={pageNum === currPage ? "initial" : "gray.400"}
                        cursor="pointer"
                        onClick={() => setCurrPage(pageNum)}
                      >
                        {pageNum}
                      </Text>
                    ))}
                    {currPage < totalPages - 2 && (
                      <>
                        <Text>...</Text>
                        <Text
                          onClick={() => setCurrPage(totalPages)}
                          cursor="pointer"
                        >
                          {totalPages}
                        </Text>
                      </>
                    )}
                  </>
                )}
                <IconButton
                  aria-label="Next page"
                  bg="transparent"
                  onClick={() => setCurrPage(currPage + 1)}
                  _hover={{ bg: "transparent" }}
                  isDisabled={currPage === totalPages}
                  icon={<Icon as={FiChevronRight} />}
                />
              </Flex>
            </>
          )}
        </>
      ) : (
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          h="full"
        >
          <Text
            color={colorMode === "dark" ? "#433A5E" : "initial"}
            textAlign="center"
            mt={8}
            fontSize="24px"
            fontWeight="bold"
            my="auto"
          >
            It looks like you haven&apos;t deployed any contracts.
          </Text>
          <Box alignSelf="center" justifySelf="end" pb={8}>
            <ChakraNextImage
              src={require("public/assets/bear-market-airdrop/gift.svg")}
              alt="gift-image"
              mx="auto"
              mb={4}
            />
            <Text>Want to be eligible for future airdrops?</Text>
            <TrackedLink
              href="/dashboard/contracts/deploy"
              target="_blank"
              category={BEAR_MARKET_TRACKING_CATEGORY}
              label="contracts_deployed"
              trackingProps={{
                contractLabel: "deploy_contract",
              }}
            >
              <Text color="blue.500">Deploy a contract on thirdweb &rarr;</Text>
            </TrackedLink>
          </Box>
        </Flex>
      )}
    </Card>
  );
};
