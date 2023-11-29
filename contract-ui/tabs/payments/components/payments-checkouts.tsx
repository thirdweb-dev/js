import { usePaymentsCheckoutsByContract } from "@3rdweb-sdk/react/hooks/usePayments";
import {
  ButtonGroup,
  Center,
  Flex,
  Icon,
  IconButton,
  Stack,
  useClipboard,
} from "@chakra-ui/react";
import { CreateUpdateCheckoutButton } from "./create-update-checkout-button";
import { Text, Heading, Link, LinkButton, Card } from "tw-components";
import { THIRDWEB_PAYMENTS_API_HOST } from "constants/urls";
import { useTrack } from "hooks/analytics/useTrack";
import { IoMdCheckmark } from "react-icons/io";
import { FiCopy } from "react-icons/fi";
import { AiOutlineQrcode } from "react-icons/ai";
import { RemoveCheckoutButton } from "./remove-checkout-button";
import { Checkout } from "graphql/generated_types";

interface PaymentCheckoutsProps {
  contractId: string;
  contractAddress: string;
  paymentContractType: string;
}

export const PaymentCheckouts: React.FC<PaymentCheckoutsProps> = ({
  contractId,
  contractAddress,
  paymentContractType,
}) => {
  const { data: checkouts } = usePaymentsCheckoutsByContract(contractAddress);

  return (
    <Flex flexDir="column" gap={6}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="title.md">Checkout Links</Heading>
        <CreateUpdateCheckoutButton
          contractAddress={contractAddress}
          contractId={contractId}
          paymentContractType={paymentContractType}
        />
      </Flex>
      <Flex flexDir="column" gap={4}>
        {checkouts?.length === 0 && (
          <Card p={8} bgColor="backgroundCardHighlight" my={6}>
            <Center as={Stack} spacing={2}>
              <Heading size="title.sm">No checkouts found</Heading>
              <Text>Please create your first one to begin</Text>
            </Center>
          </Card>
        )}
        {checkouts?.map((checkout) => {
          const checkoutLink = `${THIRDWEB_PAYMENTS_API_HOST}/checkout/${checkout.id}`;
          return (
            <Flex
              key={checkout.id}
              as={Flex}
              flexDir="column"
              borderBottom="1px solid"
              borderColor="borderColor"
              _last={{ borderBottom: "none" }}
              pb={4}
            >
              <Text>{checkout.collection_title || "Checkout"}</Text>
              <Flex justifyContent="space-between">
                <Flex gap={1} alignItems="center">
                  <Text fontFamily="mono">
                    <Link href={checkoutLink} isExternal color="primary.500">
                      {checkoutLink}
                    </Link>
                  </Text>
                  <CopyCheckoutButton text={checkoutLink} />
                </Flex>
                <ButtonGroup>
                  <CreateUpdateCheckoutButton
                    contractAddress={checkout.contract_address}
                    contractId={contractId}
                    paymentContractType={paymentContractType}
                    checkoutId={checkout.id}
                    checkout={checkout as Checkout}
                  />
                  <IconButton
                    as={LinkButton}
                    variant="outline"
                    icon={<Icon as={AiOutlineQrcode} />}
                    aria-label="Generate QR Code"
                    href={`${THIRDWEB_PAYMENTS_API_HOST}/dashboard/checkout/qr-code?url=${encodeURIComponent(
                      checkoutLink,
                    )}`}
                    isExternal
                    noIcon
                    bg="none"
                  />
                  <RemoveCheckoutButton
                    contractAddress={contractAddress}
                    checkoutId={checkout.id}
                  />
                </ButtonGroup>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export const CopyCheckoutButton: React.FC<{ text: string }> = ({ text }) => {
  const { onCopy, hasCopied } = useClipboard(text);
  const trackEvent = useTrack();
  return (
    <IconButton
      borderRadius="md"
      variant="ghost"
      colorScheme="whiteAlpha"
      size="sm"
      aria-label="Copy checkout link"
      onClick={() => {
        onCopy();
        trackEvent({
          category: "payments",
          action: "click",
          label: "copy-checkout-link",
          text,
        });
      }}
      icon={
        <Icon
          as={hasCopied ? IoMdCheckmark : FiCopy}
          fill={hasCopied ? "green.500" : undefined}
        />
      }
    />
  );
};
