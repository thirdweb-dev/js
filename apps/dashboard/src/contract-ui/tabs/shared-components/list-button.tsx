import { ListerOnly } from "@3rdweb-sdk/react/components/roles/lister-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { thirdwebClient } from "lib/thirdweb-client";
import { useV5DashboardChain } from "lib/v5-adapter";
import { FiPlus } from "react-icons/fi";
import { getContract } from "thirdweb";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { Button, Drawer } from "tw-components";
import { CreateListingsForm } from "../listings/components/list-form";

const LIST_FORM_ID = "marketplace-list-form";

interface CreateListingButtonProps {
  contractAddress: string;
  chainId: number;
  createText?: string;
  type?: "direct-listings" | "english-auctions";
}

export const CreateListingButton: React.FC<CreateListingButtonProps> = ({
  createText = "Create",
  type,
  contractAddress,
  chainId,
  ...restButtonProps
}) => {
  const address = useActiveAccount()?.address;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate, isPending } = useSendAndConfirmTransaction();
  const chain = useV5DashboardChain(chainId);
  const contract = getContract({
    address: contractAddress,
    chain: chain,
    client: thirdwebClient,
  });
  return (
    <ListerOnly contract={contract}>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
        header={{ children: createText }}
        footer={{
          children: (
            <>
              <Button
                isDisabled={isPending}
                variant="outline"
                mr={3}
                onClick={onClose}
              >
                Cancel
              </Button>
              <TransactionButton
                isLoading={isPending}
                transactionCount={2}
                form={LIST_FORM_ID}
                type="submit"
                colorScheme="primary"
              >
                {createText}
              </TransactionButton>
            </>
          ),
        }}
      >
        <CreateListingsForm
          contract={contract}
          formId={LIST_FORM_ID}
          type={type}
          mutate={mutate}
        />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiPlus} />}
        {...restButtonProps}
        onClick={onOpen}
        isDisabled={!address}
      >
        {createText}
      </Button>
    </ListerOnly>
  );
};
