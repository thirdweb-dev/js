import { ListerOnly } from "@3rdweb-sdk/react/components/roles/lister-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import type { UseContractResult } from "@thirdweb-dev/react";
import type { Marketplace, MarketplaceV3 } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { thirdwebClient } from "lib/thirdweb-client";
import { defineDashboardChain } from "lib/v5-adapter";
import { FiPlus } from "react-icons/fi";
import { getContract } from "thirdweb";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { Button, Drawer } from "tw-components";
import { CreateListingsForm } from "../listings/components/list-form";

const LIST_FORM_ID = "marketplace-list-form";

interface CreateListingButtonProps {
  contractQuery:
    | UseContractResult<Marketplace>
    | UseContractResult<MarketplaceV3>;
  createText?: string;
  type?: "direct-listings" | "english-auctions";
}

export const CreateListingButton: React.FC<CreateListingButtonProps> = ({
  contractQuery,
  createText = "Create",
  type,
  ...restButtonProps
}) => {
  const address = useActiveAccount()?.address;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate, isPending } = useSendAndConfirmTransaction();
  if (!contractQuery?.contract) {
    return null;
  }
  const contract = getContract({
    address: contractQuery.contract.getAddress(),
    chain: defineDashboardChain(contractQuery.contract.chainId),
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
