import { CreateListingsForm } from "./list-form";
import { ListerOnly } from "@3rdweb-sdk/react/components/roles/lister-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import {
  UseContractResult,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import { Marketplace } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/prebuilt-implementations/marketplace";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FiPlus } from "react-icons/fi";
import { Button, Drawer } from "tw-components";

const LIST_FORM_ID = "marketplace-list-form";

interface CreateListingButtonProps {
  contractQuery: UseContractResult<Marketplace>;
}

export const CreateListingButton: React.FC<CreateListingButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
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
        header={{ children: "Create Listing" }}
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
                Create Listing
              </TransactionButton>
            </>
          ),
        }}
      >
        <CreateListingsForm
          directList={directList}
          auctionList={auctionList}
          formId={LIST_FORM_ID}
        />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiPlus} />}
        {...restButtonProps}
        onClick={onOpen}
      >
        Create Listing
      </Button>
    </ListerOnly>
  );
};
