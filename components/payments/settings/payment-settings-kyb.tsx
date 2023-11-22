import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Flex,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { Text, Link, Heading, Card } from "tw-components";
import { KybFileUploader } from "./kyb-file-uploader";
import { usePaymentsKybStatus } from "@3rdweb-sdk/react/hooks/usePayments";

export const PaymentsSettingsKyb: React.FC = () => {
  const { data } = usePaymentsKybStatus();

  return (
    <Flex flexDir="column" gap={3}>
      <Text color="faded">
        Upload documents which include the following information:
      </Text>
      <UnorderedList>
        <Text as={ListItem}>Tax ID</Text>
        <Text as={ListItem}>Company Name</Text>
        <Text as={ListItem}>Proof of Address</Text>
      </UnorderedList>

      <KybFileUploader />
      {data?.fileNames.length > 0 && (
        <Flex flexDir="column" gap={4}>
          <Heading size="title.sm">Submitted files:</Heading>
          <Flex flexDir="column" gap={2}>
            {data.fileNames.map((fileName: string, idx: number) => (
              <Card key={idx} py={1} borderRadius="md">
                <Text>{fileName}</Text>
              </Card>
            ))}
          </Flex>
          <Alert
            status="info"
            borderRadius="xl"
            alignItems="center"
            gap={2}
            variant="left-accent"
          >
            <AlertIcon />
            <Flex direction="column" gap={2}>
              <Heading size="title.xs">Information is pending review.</Heading>
              <Text>
                This typically takes around 2-3 business days. You can email{" "}
                <Link href="mailto:compliance@thirdweb.com">
                  compliance@thirdweb.com
                </Link>{" "}
                for any questions.
              </Text>
            </Flex>
          </Alert>
        </Flex>
      )}
      <Text color="faded">
        Insufficient documents will deny production access. Compliance at
        thirdweb reserves the right to approve or reject based on information
        provided and deemed risk associated.
      </Text>
      <Accordion allowToggle>
        <AccordionItem border="none">
          <AccordionButton pl={0}>
            <AccordionIcon />
            <Text ml={2}>Why is my data collected?</Text>
          </AccordionButton>
          <AccordionPanel>
            <Text>
              thirdweb operates in the United States and voluntarily adheres to
              regulations such as Anti-Money Laundering (AML), Combating the
              Financing of Terrorism (CFT), and Office of Foreign Assets Control
              (OFAC). We will never share your data to third parties.
            </Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem border="none">
          <AccordionButton pl={0}>
            <AccordionIcon />
            <Text ml={2}>How is my data secured?</Text>
          </AccordionButton>
          <AccordionPanel>
            <Text>
              The upload button generates a short-lived, pre-signed upload URL.
              This bucket is encrypted via{" "}
              <Link
                href="https://aws.amazon.com/kms/"
                isExternal
                color="primary.500"
              >
                AWS Key Management Service
              </Link>{" "}
              and is never exposed publicly. Your data does not pass through
              thirdweb&apos;s servers. Employees at thirdweb with critical
              business need will read this data to verify your business entity.
            </Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};
