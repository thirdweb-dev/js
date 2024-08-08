import { thirdwebClient } from "@/constants/client";
import { useEVMContractInfo } from "@3rdweb-sdk/react";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  Icon,
  List,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Tooltip,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineQuestionCircle } from "@react-icons/all-files/ai/AiOutlineQuestionCircle";
import { useSDKChainId } from "@thirdweb-dev/react-core";
import { AnimatePresence, motion } from "framer-motion";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useRouter } from "next/router";
import { type ReactNode, useMemo, useState } from "react";
import { FiChevronDown, FiCopy } from "react-icons/fi";
import type { ChainsawTransaction, ChainsawTransactions } from "thirdweb";
import { Button, Card, Heading, Text } from "tw-components";
import { toDateTimeLocal } from "utils/date-utils";
import { useGetTransactions } from "../hooks/useGetTransactions";

interface TransactionsFeedProps {
  contractAddress?: string;
}

type UIData = {
  transactions: ChainsawTransactions;
  showLoadMore: boolean;
};

type ProcessedQuery = {
  data?: UIData;
  isError?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
};

function processQuery(
  transactionsQuery: ReturnType<typeof useGetTransactions>,
): ProcessedQuery {
  if (transactionsQuery.isLoading) {
    return { isLoading: true };
  }

  if (transactionsQuery.isError) {
    return { isError: true };
  }

  const transactions = transactionsQuery.data.pages.flatMap(
    (page) => page.pageData,
  );

  if (transactions.length === 0) {
    return { isEmpty: true };
  }

  return {
    data: {
      transactions,
      showLoadMore: !!transactionsQuery.hasNextPage,
    },
  };
}

export const TransactionsFeed: React.FC<TransactionsFeedProps> = ({
  contractAddress,
}) => {
  const activeChainId = useSDKChainId();
  const getTransactionsQuery = useGetTransactions({
    client: thirdwebClient,
    to: contractAddress,
    chainIds: [activeChainId],
    pageSize: 20,
  });

  const uiQuery = processQuery(getTransactionsQuery);
  const allTransactions: ChainsawTransactions =
    uiQuery.data?.transactions || [];

  const functionName = useSingleQueryParam("functionName");
  const [selectedFunctionName, setSelectedFunctionName] = useState(
    functionName || "all",
  );

  const chainSlug = useEVMContractInfo()?.chainSlug;

  const router = useRouter();

  const functionCalls = useMemo(
    () =>
      Array.from(
        new Set([
          ...allTransactions.map(
            (tx: ChainsawTransaction) => tx?.decoded?.functionName,
          ),
        ]),
      ),
    [allTransactions],
  );

  const filteredFunctionCalls = useMemo(
    () =>
      selectedFunctionName === "all"
        ? allTransactions
        : allTransactions.filter(
            (tx: ChainsawTransaction) =>
              tx?.decoded?.functionName === selectedFunctionName,
          ),
    [allTransactions, selectedFunctionName],
  );

  return (
    <Flex gap={6} flexDirection="column">
      <Flex align="center" justify="space-between" w="full">
        <Flex gap={4} alignItems="center">
          <Heading flexShrink={0} size="title.sm">
            Latest Transactions
          </Heading>
          <Select
            w="50%"
            value={selectedFunctionName}
            onChange={(e) => {
              const val = e.target.value;
              const allIsSelected = val === "all";
              if (allIsSelected || functionCalls.includes(val)) {
                const path = allIsSelected
                  ? `/${chainSlug}/${contractAddress}/transactions`
                  : `/${chainSlug}/${contractAddress}/transactions?functionName=${encodeURIComponent(val)}`;
                router.push(path);
                setSelectedFunctionName(val);
              }
            }}
          >
            <option value="all">All</option>
            {functionCalls.map((functionCall) => (
              <option key={functionCall} value={functionCall}>
                {functionCall}
              </option>
            ))}
          </Select>
        </Flex>
      </Flex>
      {contractAddress && (
        <Card p={0} overflow="hidden">
          <SimpleGrid
            gap={2}
            columns={12}
            borderBottomWidth="1px"
            borderColor="borderColor"
            padding={4}
            bg="blackAlpha.50"
            _dark={{ bg: "whiteAlpha.50" }}
          >
            <Heading gridColumn="span 4" size="label.md">
              Transaction Hash
            </Heading>
            <Heading gridColumn="span 5" size="label.md">
              Function
            </Heading>
            <Heading gridColumn="span 3" size="label.md">
              Date
            </Heading>
          </SimpleGrid>

          <List overflow="auto">
            {filteredFunctionCalls.length === 0 && (
              <Center py={4}>
                <Flex align="center" gap={2}>
                  {getTransactionsQuery.isLoading && (
                    <Spinner size="sm" speed="0.69s" />
                  )}
                </Flex>
              </Center>
            )}
            <Accordion
              as={AnimatePresence}
              initial={false}
              allowMultiple
              defaultIndex={[]}
            >
              {filteredFunctionCalls?.map((t: ChainsawTransaction) => (
                <TransactionsFeedItem
                  key={t.transactionHash}
                  transaction={t}
                  setSelectedEvent={setSelectedFunctionName}
                  contractAddress={contractAddress}
                  chainSlug={chainSlug}
                />
              ))}
            </Accordion>
          </List>
        </Card>
      )}
    </Flex>
  );
};

interface TransactionsFeedItemProps {
  transaction: ChainsawTransaction;
  setSelectedEvent: React.Dispatch<React.SetStateAction<string>>;
  contractAddress: string;
  chainSlug?: string;
}

const TransactionsFeedItem: React.FC<TransactionsFeedItemProps> = ({
  transaction,
  setSelectedEvent,
  contractAddress,
  chainSlug,
}) => {
  const toast = useToast();
  const { onCopy } = useClipboard(transaction.transactionHash);

  const router = useRouter();

  return (
    <AccordionItem
      borderBottom="none"
      borderColor="borderColor"
      _first={{ borderTop: "none" }}
    >
      <AccordionButton padding={0}>
        <SimpleGrid
          columns={12}
          gap={2}
          as={motion.li}
          initial={{
            y: -30,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0,
            height: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
            height: "auto",
            paddingTop: "var(--chakra-space-3)",
            paddingBottom: "var(--chakra-space-3)",
            transition: { duration: 0.15 },
          }}
          exit={{
            y: 30,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0,
            height: 0,
            transition: { duration: 0.3 },
          }}
          willChange="opacity, height, paddingTop, paddingBottom"
          borderBottomWidth="1px"
          borderColor="borderColor"
          padding={4}
          overflow="hidden"
          alignItems="center"
          _last={{ borderBottomWidth: 0 }}
        >
          <Box gridColumn="span 3">
            <Stack direction="row" align="center" spacing={3}>
              <Tooltip
                p={0}
                bg="transparent"
                boxShadow="none"
                label={
                  <Card py={2} px={4} bgColor="backgroundHighlight">
                    <Text size="label.sm">
                      Copy transaction hash to clipboard
                    </Text>
                  </Card>
                }
              >
                <Button
                  size="sm"
                  bg="transparent"
                  onClick={() => {
                    onCopy();
                    toast({
                      variant: "solid",
                      position: "bottom",
                      title: "Transaction hash copied.",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                    });
                  }}
                >
                  <Icon as={FiCopy} boxSize={3} />
                </Button>
              </Tooltip>
              <Text fontFamily="mono" noOfLines={1}>
                {transaction.hash.slice(0, 32)}...
              </Text>
            </Stack>
          </Box>

          <Box gridColumn="span 1" />

          <ButtonGroup
            size="sm"
            variant="outline"
            gridColumn="span 5"
            flexWrap="wrap"
            gap={2}
            spacing={0}
          >
            <Button
              as="span"
              onClick={(ev) => {
                ev.stopPropagation();
                router.push(
                  `/${chainSlug}/${contractAddress}/transactions?functionName=${transaction?.decoded?.functionName}`,
                );
                setSelectedEvent(transaction?.decoded?.functionName);
              }}
            >
              {transaction?.decoded?.functionName}
            </Button>
          </ButtonGroup>

          <Box gridColumn="span 3">
            <Stack direction="row" justify="space-between">
              <Text fontFamily="mono" noOfLines={1}>
                {toDateTimeLocal(transaction.time)}
              </Text>
              <Box>
                <Icon as={FiChevronDown} />
              </Box>
            </Stack>
          </Box>
        </SimpleGrid>
      </AccordionButton>
      <AccordionPanel>
        <Card>
          <Stack spacing={4}>
            <TransactionData
              name="Transaction Hash"
              value={transaction.hash}
              description={`
                  A transaction hash is a unique 66 character identifier
                  that is generated whenever a transaction is executed.
                `}
            />

            <TransactionData
              name="Block Number"
              value={transaction.blockNumber.toString()}
              description={`
                  The number of the block in which the transaction was recorded.
                  Block confirmation indicate how many blocks since the transaction was validated.
                `}
            />

            <TransactionData
              name="From"
              value={transaction.from}
              description={"The address from which the transaction came."}
            />

            {transaction.decoded?.args && (
              <TransactionData
                name="Arguments"
                value={
                  <pre>
                    {JSON.stringify(
                      JSON.parse(transaction.decoded.args),
                      null,
                      2,
                    )}
                  </pre>
                }
                description={"Arguments of the function call."}
              />
            )}
          </Stack>
        </Card>
      </AccordionPanel>
    </AccordionItem>
  );
};

interface TransactionDataProps {
  name: string;
  value: string | number | ReactNode;
  description: string;
}

const TransactionData: React.FC<TransactionDataProps> = ({
  name,
  value,
  description,
}) => {
  return (
    <>
      <SimpleGrid columns={12} gap={2}>
        <Stack direction="row" align="center" gridColumn="span 3">
          <Tooltip
            p={0}
            bg="transparent"
            boxShadow="none"
            label={
              <Card py={2} px={4} bgColor="backgroundHighlight">
                <Text size="label.sm">{description}</Text>
              </Card>
            }
          >
            <Center>
              <Icon as={AiOutlineQuestionCircle} color="gray.600" />
            </Center>
          </Tooltip>

          <Text fontWeight="bold">{name}</Text>
        </Stack>

        <Text gridColumn="span 9">{value}</Text>
      </SimpleGrid>
      <Divider />
    </>
  );
};
