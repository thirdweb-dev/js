"use client";

import { ListerOnly } from "@3rdweb-sdk/react/components/roles/lister-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import type { ThirdwebContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { Button, Drawer } from "tw-components";
import { CreateListingsForm } from "../listings/components/list-form";

const LIST_FORM_ID = "marketplace-list-form";

interface CreateListingButtonProps {
  contract: ThirdwebContract;
  createText?: string;
  type?: "direct-listings" | "english-auctions";
}

export const CreateListingButton: React.FC<CreateListingButtonProps> = ({
  createText = "Create",
  type,
  contract,
  ...restButtonProps
}) => {
  const address = useActiveAccount()?.address;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFormLoading, setIsFormLoading] = useState(false);

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
                isDisabled={isFormLoading}
                variant="outline"
                mr={3}
                onClick={onClose}
              >
                Cancel
              </Button>
              <TransactionButton
                txChainID={contract.chain.id}
                isLoading={isFormLoading}
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
          setIsFormLoading={setIsFormLoading}
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
