import { CreateListingsForm } from "../listings/components/list-form";
import { ListerOnly } from "@3rdweb-sdk/react/components/roles/lister-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import {
  UseContractResult,
  useAddress,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import type { Marketplace, MarketplaceV3 } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FiPlus } from "react-icons/fi";
import { Button, Drawer } from "tw-components";

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
  const address = useAddress();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const directList = useCreateDirectListing(contractQuery.contract);
  const auctionList = useCreateAuctionListing(contractQuery.contract);

  return (
    <ListerOnly contract={contractQuery?.contract}>
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
                isDisabled={directList.isLoading || auctionList.isLoading}
                variant="outline"
                mr={3}
                onClick={onClose}
              >
                Cancel
              </Button>
              <TransactionButton
                isLoading={directList.isLoading || auctionList.isLoading}
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
          contractQuery={contractQuery}
          directList={directList}
          auctionList={auctionList}
          formId={LIST_FORM_ID}
          type={type}
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
