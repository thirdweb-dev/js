import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  type CreateTicketInput,
  useCreateTicket,
} from "@3rdweb-sdk/react/hooks/useCreateSupportTicket";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { type ReactElement, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Heading } from "tw-components";
import { SubmitTicketButton } from "./SubmitTicketButton";
import { SupportForm_SelectInput } from "./contact-forms/shared/SupportForm_SelectInput";

const ConnectSupportForm = dynamic(() => import("./contact-forms/connect"), {
  ssr: false,
});
const EngineSupportForm = dynamic(() => import("./contact-forms/engine"), {
  ssr: false,
});
const ContractSupportForm = dynamic(() => import("./contact-forms/contracts"), {
  ssr: false,
});
const AccountSupportForm = dynamic(() => import("./contact-forms/account"), {
  ssr: false,
});
const OtherSupportForm = dynamic(() => import("./contact-forms/other"), {
  ssr: false,
});

const productOptions: { label: string; component: ReactElement }[] = [
  {
    label: "Connect",
    component: <ConnectSupportForm />,
  },
  {
    label: "Engine",
    component: <EngineSupportForm />,
  },
  {
    label: "Contracts",
    component: <ContractSupportForm />,
  },
  {
    label: "Account",
    component: <AccountSupportForm />,
  },
  {
    label: "Other",
    component: <OtherSupportForm />,
  },
];

export const ContactSupportModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const form = useForm<CreateTicketInput>();
  const productLabel = form.watch("product");
  const { isLoggedIn } = useLoggedInUser();
  const { mutate: createTicket } = useCreateTicket();

  // On changing product -> reset all fields (but keep the `product` field)
  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!productLabel) {
      return;
    }
    const label = productLabel;
    form.reset();
    form.reset({ product: label });
  }, [productLabel, form]);

  return (
    <>
      <Box
        position={{ base: "fixed", md: "relative" }}
        bottom={{ base: 4, md: "auto" }}
        right={{ base: 4, md: "auto" }}
        zIndex={{ base: "popover", md: "auto" }}
      >
        <Button onClick={onOpen} colorScheme="primary">
          Submit a ticket
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <FormProvider {...form}>
          <ModalContent
            as="form"
            onSubmit={form.handleSubmit((data) => {
              try {
                createTicket(data);
                onClose();
                form.reset();
              } catch (err) {
                console.error(err);
              }
            })}
          >
            <ModalHeader>
              <Heading size="title.md" mt={2}>
                Get in touch with us
              </Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={6} as={Flex} gap={4} flexDir="column">
              <SupportForm_SelectInput
                formLabel="What do you need help with?"
                formValue="product"
                options={productOptions.map((o) => o.label)}
                promptText="Select a product"
                required={true}
              />
              {productOptions.find((o) => o.label === productLabel)?.component}
            </ModalBody>
            <ModalFooter as={Flex} gap={3}>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
              {isLoggedIn ? <SubmitTicketButton /> : <CustomConnectWallet />}
            </ModalFooter>
          </ModalContent>
        </FormProvider>
      </Modal>
    </>
  );
};
