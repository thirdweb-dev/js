import {
  isPaymentsSupported,
  usePaymentsSellerByAccountId,
  validPaymentsChainIds,
  validPaymentsChainIdsMainnets,
} from "@3rdweb-sdk/react/hooks/usePayments";
import { Center, Stack } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { EnablePaymentsButton } from "components/payments/enable-payments-button";
import { Card, Heading, Text, TrackedLinkButton } from "tw-components";

interface NoPaymentsEnabledProps {
  contractAddress: string;
  accountId: string;
  chainId?: number;
}

export const NoPaymentsEnabled: React.FC<NoPaymentsEnabledProps> = ({
  contractAddress,
  accountId,
  chainId,
}) => {
  const { data: sellerData } = usePaymentsSellerByAccountId(accountId);
  const isMainnet = validPaymentsChainIdsMainnets.includes(chainId ?? 0);
  const isSupportedChain = validPaymentsChainIds.includes(chainId ?? 0);

  const { contract } = useContract(contractAddress);
  const isValidContract = isPaymentsSupported(contract);

  return (
    <Card p={8} bgColor="backgroundCardHighlight" my={6}>
      <Center as={Stack} spacing={4}>
        <Stack spacing={2}>
          <Heading size="title.sm" textAlign="center">
            No payments enabled
          </Heading>
          <Text>
            {!isValidContract
              ? "We don't currently support this contract, you can contact us if you need payments enabled for this contract."
              : isMainnet
              ? "You need to KYC first before being able to enable payments on mainnet."
              : isSupportedChain
              ? "You need to enable payments first to be able to create a checkout."
              : "Payments is not currently supported on this chain, you can contact us if you need this chain enabled."}
          </Text>
        </Stack>
        {!isSupportedChain || !isValidContract ? (
          <TrackedLinkButton
            href="/contact-us"
            category="payments"
            label="contact-us"
            bgColor="bgWhite"
            _hover={{
              bgColor: "bgWhite",
              opacity: 0.8,
            }}
            color="bgBlack"
            size="sm"
          >
            Contact Us
          </TrackedLinkButton>
        ) : isMainnet && !sellerData?.date_personal_documents_verified ? (
          <TrackedLinkButton
            href="/dashboard/payments/settings"
            category="payments"
            label="kyc"
            bgColor="bgWhite"
            _hover={{
              bgColor: "bgWhite",
              opacity: 0.8,
            }}
            color="bgBlack"
            size="sm"
          >
            Go to KYC
          </TrackedLinkButton>
        ) : chainId ? (
          <EnablePaymentsButton
            contractAddress={contractAddress}
            chainId={chainId}
          />
        ) : null}
      </Center>
    </Card>
  );
};
