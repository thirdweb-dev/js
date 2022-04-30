import { useTableContext } from "../table-context";
import { useAirdropMutation } from "@3rdweb-sdk/react";
import { Flex, Icon, Stack, useDisclosure } from "@chakra-ui/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import {
  AirdropAddressInput,
  AirdropUpload,
} from "components/batch-upload/AirdropUpload";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { BsCircleFill } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import { Button, Text } from "tw-components";

interface IAirdropSection {
  contract?: ValidContractInstance;
  tokenId: string;
}

export const AirdropSection: React.FC<IAirdropSection> = ({
  contract,
  tokenId,
}) => {
  const { handleSubmit, setValue, watch } = useForm<{
    addresses: AirdropAddressInput[];
  }>({
    defaultValues: { addresses: [] },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const airdrop = useAirdropMutation(contract);
  const { closeAllRows } = useTableContext();

  const { onSuccess, onError } = useTxNotifications(
    "Airdrop successful",
    "Error transferring",
  );

  const onSubmit = useCallback(
    (data) => {
      airdrop.mutate(
        {
          tokenId,
          addresses: data.addresses,
        },
        {
          onError,
          onSuccess: () => {
            onSuccess();
            closeAllRows();
          },
        },
      );
    },
    [airdrop, tokenId, onError, onSuccess, closeAllRows],
  );

  const addresses = watch("addresses");

  return (
    <Stack pt={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack align="center">
          <Stack
            spacing={6}
            w="100%"
            direction={{ base: "column", md: "row" }}
            justifyContent="center"
            mb={3}
          >
            <AirdropUpload
              isOpen={isOpen}
              onClose={onClose}
              setAirdrop={(value) => setValue(`addresses`, value)}
            />
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              gap={4}
            >
              <Button
                colorScheme="primary"
                borderRadius="md"
                onClick={onOpen}
                rightIcon={<Icon as={FiUpload} />}
              >
                Upload addresses
              </Button>

              <Flex
                gap={2}
                direction="row"
                align="center"
                justify="center"
                color={addresses.length === 0 ? "orange.500" : "green.500"}
              >
                {addresses.length > 0 && (
                  <>
                    <Icon as={BsCircleFill} boxSize={2} />
                    <Text size="body.sm" color="inherit">
                      <strong>{addresses.length} addresses</strong> ready to be
                      airdropped
                    </Text>
                  </>
                )}
              </Flex>
            </Flex>
          </Stack>
          <TransactionButton
            transactionCount={1}
            isLoading={airdrop.isLoading}
            type="submit"
            colorScheme="primary"
            disabled={addresses.length === 0}
            rightIcon={<Icon as={IoMdSend} />}
          >
            Airdrop
          </TransactionButton>
        </Stack>
      </form>
    </Stack>
  );
};
