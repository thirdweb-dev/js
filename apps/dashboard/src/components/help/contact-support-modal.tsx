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
import { FormProvider, useForm } from "react-hook-form";
import { Button, Heading } from "tw-components";
import {
  CreateTicketInput,
  useCreateTicket,
} from "@3rdweb-sdk/react/hooks/useApi";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import dynamic from "next/dynamic";
import { ReactElement, useEffect } from "react";
import { SupportForm_SelectInput } from "./contact-forms/shared/SupportForm_SelectInput";
import { SubmitTicketButton } from "./SubmitTicketButton";
import { VscError } from "react-icons/vsc";
import Link from "next/link";
import { Spinner } from "../../@/components/ui/Spinner/Spinner";
import { FaCheckCircle } from "react-icons/fa";

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

const SUPPORT_EMAIL = "support@thirdweb.com";

export const ContactSupportModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const form = useForm<CreateTicketInput>();
  const productLabel = form.watch("product");
  const { isLoggedIn } = useLoggedInUser();
  const {
    mutate: createTicket,
    error,
    isSuccess,
    isLoading,
    reset: resetRequest,
  } = useCreateTicket();

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

  const FormComponent = () => {
    return (
      productOptions.find((o) => o.label === productLabel)?.component || <></>
    );
  };

  const CloseFooter = () => {
    return (
      <ModalFooter as={Flex} gap={3}>
        <Button
          onClick={() => {
            onClose();
            form.reset();
            resetRequest();
          }}
          variant="ghost"
        >
          Close
        </Button>
      </ModalFooter>
    );
  };

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
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          form.reset();
          resetRequest();
        }}
        isCentered
      >
        <ModalOverlay />
        <FormProvider {...form}>
          <ModalContent
            as="form"
            onSubmit={form.handleSubmit((data) => createTicket(data))}
          >
            <ModalCloseButton isDisabled={isLoading} />
            {error ? (
              <>
                <ModalBody p={6} as={Flex} gap={4} flexDir="column">
                  <VscError size={50} className="mx-auto mt-5" />
                  <Box textAlign={"center"} mx={"auto"} color={"red"}>
                    Oops, something went wrong
                  </Box>
                  <Box textAlign={"center"}>
                    If the problem persists, please reach out to us directly via{" "}
                    <Link
                      href={`mailto:${SUPPORT_EMAIL}?subject=${form.getValues().product}&body=${form.getValues().markdown}`}
                      target="_blank"
                      className="underline"
                    >
                      {SUPPORT_EMAIL}
                    </Link>
                  </Box>
                </ModalBody>
                <CloseFooter />
              </>
            ) : (
              <>
                {isSuccess ? (
                  <>
                    <ModalBody p={6} as={Flex} gap={4} flexDir="column">
                      <FaCheckCircle size={50} className="mx-auto mt-5" />
                      <Box textAlign={"center"} mx={"auto"} color={"green"}>
                        Ticket submitted successfully
                      </Box>
                      <Box textAlign={"center"}>
                        You will hear back from us shortly.
                      </Box>
                    </ModalBody>
                    <CloseFooter />
                  </>
                ) : (
                  <>
                    {isLoading ? (
                      <>
                        <ModalHeader>
                          <Heading size="title.md" mt={2}>
                            Submitting ticket
                          </Heading>
                        </ModalHeader>
                        <ModalBody p={6} as={Flex} gap={4} flexDir="column">
                          <Box m={"auto"}>
                            <Spinner className="size-10" />
                          </Box>
                        </ModalBody>
                      </>
                    ) : (
                      <>
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
                          <FormComponent />
                        </ModalBody>
                        <ModalFooter as={Flex} gap={3}>
                          <Button onClick={onClose} variant="ghost">
                            Cancel
                          </Button>
                          {isLoggedIn ? (
                            <SubmitTicketButton />
                          ) : (
                            <ConnectWallet />
                          )}
                        </ModalFooter>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </ModalContent>
        </FormProvider>
      </Modal>
    </>
  );
};
