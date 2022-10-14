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
    question: "What is the Solana Faucet?",
    answer:
      "A Solana faucet is a tool for developers to get free devnet Solana (SOL) tokens to test their applications before deploying them to mainnet. The thirdweb Solana faucet is free, fast, and does not require authentication or login.",
  },
  {
    question: "What are Solana devnet tokens?",
    answer:
      "Solana Devnet is a test network where developers can test out their applications before deploying them to mainnet. Devnet transactions use test SOL tokens, so that developers do not need to spend money to test their applications.",
  },
  {
    question: "How do I use the Solana Faucet?",
    answer:
      "To request free Solana devnet funds, simply enter the wallet address you want to receive the tokens at, and click on “Request funds.” You’ll get a confirmation that your funds have sent successfully, and will be able to see them in your wallet shortly! You will receive 1 free SOL devnet token every time you request funds.",
  },
  {
    question:
      "Is the Solana devnet the same as the Solana testnet? What’s the difference between Solana devnet and testnet tokens?",
    answer:
      "The Solana devnet is not the same as the Solana testnet. It is recommended for developers to use the Solana devnet. The testnet is used by Solana labs to test upgrades to the network, while devnet is a copy of mainnet execution environment. This faucet provides devnet funds.",
  },
  {
    question: "How long will it take to get my devnet tokens?",
    answer:
      "You should receive your Solana devnet tokens immediately. Please click the “View on Solscan” link and see if your transaction has been confirmed.",
  },
  {
    question:
      "What if I still can’t get funds, run into any issues, or have questions?",
    answer: (
      <>
        Please try again in a few minutes. If the issue persists, please reach
        out to us on our{" "}
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
                <Heading mr="auto" size="label.lg" textAlign="left">
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
