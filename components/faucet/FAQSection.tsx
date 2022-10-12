import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
} from "@chakra-ui/react";
import { Card, Heading, Link, Text } from "tw-components";

const FAQs = [
  {
    question: "What are devnet funds?",
    answer:
      "Solana Devnet is a test network where developers can test out their applications before deploying them to mainnet. Devnet transactions use test SOL tokens, so that developers do not need to spend money to test their applications.",
  },
  {
    question: "How much will I get?",
    answer: "You will receive 1 SOL ",
  },
  {
    question: "How long will it take to get my devnet tokens?",
    answer:
      "You should receive your testnet funds immediately. If not, please click the “View on Solana Explorer link and see if your transaction has been confirmed.",
  },
  {
    question: "Why am I not able to get funds?",
    answer: (
      <>
        Please try again after a few minutes. If the issue persists, please
        contact us on{" "}
        <Link href="https://discord.gg/thirdweb" textDecor="underline">
          Discord{" "}
        </Link>
        or{" "}
        <Link href="https://twitter.com/thirdweb" textDecor="underline">
          Twitter
        </Link>
        .
      </>
    ),
  },
];

export const FaqSection: React.FC = () => {
  return (
    <Flex flexDir="column" mt={8} gap={6}>
      <Heading>FAQs</Heading>
      <Card p={0} overflow="hidden">
        <Accordion borderColor="borderColor" allowMultiple overflow="hidden">
          {FAQs.map(({ question, answer }) => (
            <AccordionItem
              key={question}
              _first={{ borderTop: "none" }}
              _last={{ borderBottom: "none" }}
            >
              <AccordionButton py={4}>
                <Heading mr="auto" size="label.lg">
                  {question}
                </Heading>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Text size="body.md">{answer}</Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </Flex>
  );
};
