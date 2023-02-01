import { Flex, FormControl, Input, Spinner, useToast } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";
import { useTrack } from "hooks/analytics/useTrack";
import { useEffect, useState } from "react";
import { Button, Text } from "tw-components";

interface IFormComponentProps {
  transactionLink: string;
  setTransactionLink: (link: string) => void;
}

export const FormComponent: React.FC<IFormComponentProps> = ({
  transactionLink,
  setTransactionLink,
}) => {
  const { publicKey } = useWallet();
  const [address, setAddress] = useState(publicKey?.toBase58() || "");
  const trackEvent = useTrack();
  const toast = useToast();

  useEffect(() => {
    if (publicKey) {
      setAddress(publicKey?.toBase58());
    }
  }, [publicKey]);

  const { mutate, isLoading, error, isError } = useMutation(
    async () => {
      if (!publicKey) {
        throw new Error("No wallet connected");
      }
      trackEvent({
        category: "solana-faucet",
        action: "request-funds",
        label: "attempt",
      });

      const connection = new Connection("https://api.devnet.solana.com");
      return await connection.requestAirdrop(
        publicKey,
        Number(LAMPORTS_PER_SOL),
      );
    },
    {
      onSuccess: (txHash) => {
        if (txHash) {
          setTransactionLink(
            `https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
          );
          trackEvent({
            category: "solana-faucet",
            action: "request-funds",
            label: "success",
          });
          toast({
            title: "Success",
            description: "Funds have been sent to your wallet",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      },
      onError: (err) => {
        trackEvent({
          category: "solana-faucet",
          action: "request-funds",
          label: "error",
          error: (err as Error).message,
        });
      },
    },
  );

  return (
    <Flex direction="column">
      <FormControl
        alignItems="center"
        display="flex"
        gap={{ base: 2, md: 4 }}
        justifyContent="center"
        onSubmit={() => mutate()}
      >
        <Input
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          value={address}
          isDisabled={isLoading || transactionLink.length > 0}
        />

        <Button
          colorScheme="primary"
          disabled={isLoading || transactionLink.length > 0 || !address}
          w={{ base: "full", md: "175px" }}
          fontSize={{ base: "sm", md: "md" }}
          onClick={() => {
            mutate();
          }}
        >
          {isLoading ? (
            <Spinner />
          ) : transactionLink ? (
            "Funds Sent!"
          ) : (
            "Request Funds"
          )}
        </Button>
      </FormControl>

      {isError && (
        <Text fontSize="18px" mt="4" color="red.800">
          {(error as Error).message}
        </Text>
      )}
    </Flex>
  );
};
