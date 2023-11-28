import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormControl,
  Input,
  Select,
  Textarea,
  Switch,
  Icon,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { FormProvider, useForm } from "react-hook-form";
import {
  Button,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  LinkButton,
} from "tw-components";
import {
  ChainIdToSupportedCurrencies,
  CreateUpdateCheckoutInput,
  usePaymentsCreateUpdateCheckout,
} from "@3rdweb-sdk/react/hooks/usePayments";
import { useMemo, useState } from "react";
import { Abi, NATIVE_TOKEN_ADDRESS, useContract } from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { BiPencil } from "react-icons/bi";
import { Checkout } from "graphql/generated_types";
import { ApiKeysMenu } from "components/settings/ApiKeys/Menu";
import { useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { PaymentsSettingsFileUploader } from "components/payments/settings/payment-settings-file-uploader";
import { PaymentsPreviewButton } from "./preview-button";
import { CurrencySelector } from "components/shared/CurrencySelector";
import { PriceInput } from "contract-ui/tabs/claim-conditions/components/price-input";
import { PaymentsMintMethodInput } from "./mint-method-input";

const formInputs = [
  {
    step: "info",
    fields: [
      {
        name: "title",
        label: "Collection Name",
        type: "text",
        placeholder: "My NFT Collection",
        required: true,
        helper:
          "A clear title for this checkout that is shown on the checkout UX, credit card statement, and post-purchase email.",
        sideField: false,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Checkout Description",
        required: false,
        helper: "",
        sideField: false,
      },
      {
        name: "tokenId",
        label: "Token ID",
        type: "number",
        placeholder: "0",
        required: true,
        helper: "Defines the token within the ERC-1155 contract to purchase.",
        sideField: false,
      },
      {
        name: "thirdwebClientId",
        label: "Client ID",
        type: "clientId",
        placeholder: "",
        required: true,
        helper: "You need a client ID to be able to use checkouts.",
        sideField: false,
      },
    ],
  },
  {
    step: "no-detected-extensions",
    fields: [
      {
        name: "mintFunctionName",
        label: "Mint Method",
        type: "abiSelector",
        placeholder: "",
        required: true,
        helper:
          "thirdweb's minter wallet calls this method to mint to the buyer's wallet. Note: $WALLET is a required field.",
        sideField: false,
      },
      {
        name: "priceAndCurrencySymbol",
        label: "Price per NFT",
        type: "price",
        placeholder: "",
        required: true,
        helper: "The amount to your Mint Method expects to be paid.",
        sideField: false,
      },
    ],
  },
  {
    step: "branding",
    fields: [
      {
        name: "imageUrl",
        label: "NFT Image Preview",
        type: "image",
        placeholder: "https:// or ipfs://",
        required: false,
        helper: "",
        sideField: true,
      },
      {
        name: "brandDarkMode",
        label: "Dark mode",
        type: "switch",
        placeholder: "",
        required: false,
        helper: "",
        sideField: true,
      },
      {
        name: "brandColorScheme",
        label: "Color",
        type: "select",
        options: [
          { label: "Gray", value: "gray" },
          { label: "Red", value: "red" },
          { label: "Orange", value: "orange" },
          { label: "Yellow", value: "yellow" },
          { label: "Green", value: "green" },
          { label: "Teal", value: "teal" },
          { label: "Blue", value: "blue" },
          { label: "Cyan", value: "cyan" },
          { label: "Purple", value: "purple" },
          { label: "Pink", value: "pink" },
        ],
        placeholder: "",
        required: false,
        helper: "",
        sideField: true,
      },
      {
        name: "brandButtonShape",
        label: "Button shape",
        type: "select",
        options: [
          { label: "Rounded", value: "rounded" },
          { label: "Pill", value: "pill" },
          { label: "Square", value: "square" },
        ],
        placeholder: "",
        required: false,
        helper: "",
        sideField: true,
      },
    ],
  },
  {
    step: "delivery",
    fields: [
      {
        name: "hidePaperWallet",
        label: "Allow purchasing to an email wallet",
        type: "switch",
        placeholder: "",
        required: false,
        helper: "Allow users to create a wallet via email or social login.",
        sideField: true,
      },
      {
        name: "hideExternalWallet",
        label: "Allow purchasing to an external wallet",
        type: "switch",
        placeholder: "",
        required: false,
        helper: "e.g. MetaMask, WalletConnect, Coinbase Wallet.",
        sideField: true,
      },
      {
        name: "hidePayWithCard",
        label: "Allow paying with card",
        type: "switch",
        placeholder: "",
        required: false,
        helper: "(Credit card, Apple Pay, Google Pay).",
        sideField: true,
      },
      {
        name: "hidePayWithCrypto",
        label: "Allow paying with ETH",
        type: "switch",
        placeholder: "",
        required: false,
        helper: "",
        sideField: true,
      },
      {
        name: "hidePayWithIdeal",
        label: "Allow paying with iDEAL",
        type: "switch",
        placeholder: "",
        required: false,
        helper:
          "Allow buyers from paying with iDEAL, a common payment method in the Netherlands.",
        sideField: true,
      },
    ],
  },
  {
    step: "advanced",
    fields: [
      {
        name: "limitPerTransaction",
        label: "Max quantity per purchase",
        type: "number",
        placeholder: "",
        required: false,
        helper: "Buyers can still make multiple purchases.",
        sideField: false,
      },
      {
        name: "redirectAfterPayment",
        label: "Immediately redirect after payment",
        type: "switch",
        placeholder: "",
        required: false,
        helper:
          "Buyers will be redirected to the Post-Purchase Redirect URL after payment.",
        sideField: true,
      },
      {
        name: "sendEmailOnTransferSucceeded",
        label: "Email buyers when their purchase is completed",
        type: "switch",
        placeholder: "",
        required: false,
        helper:
          "Buyers will be emailed when their purchase is successfully delivered to their wallet. Buyers are always emailed a receipt after a successful payment.",
        sideField: true,
      },
      {
        name: "successCallbackUrl",
        label: "Post-Purchase URL",
        type: "url",
        placeholder: "https://website.com/thank-you",
        required: false,
        helper:
          "A buyer will be navigated to this page after a successful purchase.",
        sideField: false,
      },
      {
        name: "cancelCallbackUrl",
        label: "Error URL",
        type: "url",
        placeholder: "https://website.com/something-went-wrong",
        required: false,
        helper:
          "A buyer will be navigated to this page if they are unable to make a purchase.",
        sideField: false,
      },
      {
        name: "twitterHandleOverride",
        label: "Seller Twitter username",
        type: "text",
        placeholder: "Enter a Twitter username without the @",
        required: false,
        helper:
          "Override your organization's Twitter username for this checkout.",
        sideField: false,
      },
    ],
  },
] as const;

type MintMethodInputs = {
  priceAndCurrencySymbol: {
    price: string;
    currencySymbol: string;
  };
  mintFunctionName: string;
  mintFunctionArgs: {
    [key: string]: string;
  };
};

type CreateUpdateCheckoutDashboardInput = CreateUpdateCheckoutInput &
  MintMethodInputs;

const convertInputsToMintMethod = ({
  mintFunctionName,
  mintFunctionArgs,
  priceAndCurrencySymbol,
}: MintMethodInputs) => {
  return {
    name: mintFunctionName,
    args: mintFunctionArgs,
    payment: {
      currency: priceAndCurrencySymbol.currencySymbol,
      value: `${priceAndCurrencySymbol.price} * $QUANTITY`,
    },
  };
};

interface CreateUpdateCheckoutButtonProps {
  contractId: string;
  contractAddress: string;
  checkout?: Checkout;
  checkoutId?: string;
}

export const CreateUpdateCheckoutButton: React.FC<
  CreateUpdateCheckoutButtonProps
> = ({ contractId, contractAddress, checkout, checkoutId }) => {
  const { contract } = useContract(contractAddress);

  const hasDetectedExtensions = checkout?.contract_type !== "CUSTOM_CONTRACT";

  const isErc1155 = detectFeatures(contract, ["ERC1155"]);

  const keysQuery = useApiKeys();

  const apiKeys = useMemo(() => {
    return (keysQuery?.data || []).filter((key) => {
      return (key.services || []).some((srv) => srv.name === "embeddedWallets");
    });
  }, [keysQuery]);

  const [step, setStep] = useState<
    "info" | "no-detected-extensions" | "branding" | "delivery" | "advanced"
  >("info");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: createOrUpdateCheckout, isLoading } =
    usePaymentsCreateUpdateCheckout(contractAddress);
  const trackEvent = useTrack();

  const values: CreateUpdateCheckoutDashboardInput = {
    title: checkout?.collection_title || "",
    description: checkout?.collection_description || "",
    successCallbackUrl: checkout?.success_callback_url || "",
    cancelCallbackUrl: checkout?.cancel_callback_url || "",
    brandButtonShape: (checkout?.brand_button_shape as any) || "rounded",
    brandColorScheme: (checkout?.brand_color_scheme as any) || "blue",
    brandDarkMode: checkout?.brand_dark_mode || false,
    contractArgs: checkout?.contract_args || undefined,
    hideNativeMint: checkout?.hide_native_mint || false,
    listingId: checkout?.listing_id || "",
    tokenId: checkout?.token_id || undefined,
    twitterHandleOverride: checkout?.seller_twitter_handle || "",
    imageUrl: checkout?.image_url || "",
    hidePaperWallet: checkout?.hide_connect_paper_wallet || false,
    hideExternalWallet: checkout?.hide_connect_external_wallet || false,
    hidePayWithCard: checkout?.hide_pay_with_card || false,
    hidePayWithCrypto: checkout?.hide_pay_with_crypto || false,
    hidePayWithIdeal: checkout?.hide_pay_with_ideal || true,
    limitPerTransaction: checkout?.limit_per_transaction || 5,
    redirectAfterPayment: checkout?.redirect_after_payment || false,
    sendEmailOnTransferSucceeded:
      checkout?.should_send_transfer_completed_email || false,
    contractId,
    thirdwebClientId:
      checkout?.thirdweb_client_id || (!checkoutId && apiKeys[0]?.key) || "",
    // dashboard only inputs, parsing mintMethod
    priceAndCurrencySymbol: {
      price: checkout?.contract_args?.mintMethod?.payment
        ? parseInt(
            checkout?.contract_args.mintMethod.payment.value || 0,
          ).toString()
        : "0",
      currencySymbol:
        checkout?.contract_args?.mintMethod?.payment?.currency || "ETH",
    },
    mintFunctionName: checkout?.contract_args?.mintMethod?.name || "",
    mintFunctionArgs: checkout?.contract_args?.mintMethod?.args || {},
  };

  const form = useForm<CreateUpdateCheckoutDashboardInput>({
    defaultValues: values,
    values,
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
  });

  const { onSuccess: onCreateSuccess, onError: onCreateError } =
    useTxNotifications(
      "Checkout created successfully.",
      "Failed to create checkout.",
    );

  const { onSuccess: onUpdateSuccess, onError: onUpdateError } =
    useTxNotifications(
      "Checkout updated successfully.",
      "Failed to update checkout.",
    );

  const onSuccess = checkoutId ? onUpdateSuccess : onCreateSuccess;
  const onError = checkoutId ? onUpdateError : onCreateError;

  const handleNext = async () => {
    await form.trigger();

    if (step === "advanced") {
      trackEvent({
        category: "payments",
        action: checkoutId ? "update-checkout" : "create-checkout",
        label: "attempt",
      });

      form.handleSubmit((data) => {
        // We need to filter in case an input from a different method has been rendered
        const filteredFunctionArgs = Object.keys(data.mintFunctionArgs)
          .filter((key) => {
            return contract?.abi
              ?.find((fn) => fn.name === data.mintFunctionName)
              ?.inputs?.some((input) => input.name === key);
          })
          .reduce(
            (obj: Record<string, any>, key) => {
              obj[key] = data.mintFunctionArgs[key];
              return obj;
            },
            {} as Record<string, any>,
          );

        const mintMethod = convertInputsToMintMethod({
          mintFunctionArgs: filteredFunctionArgs,
          mintFunctionName: data.mintFunctionName,
          priceAndCurrencySymbol: data.priceAndCurrencySymbol,
        });
        createOrUpdateCheckout(
          {
            checkoutId,
            ...data,
            limitPerTransaction: parseInt(String(data.limitPerTransaction)),
            ...(!hasDetectedExtensions && { mintMethod }),
          },
          {
            onSuccess: () => {
              onSuccess();
              onClose();
              setStep("info");
              form.reset();
              trackEvent({
                category: "payments",
                action: checkoutId ? "update-checkout" : "create-checkout",
                label: "success",
              });
            },
            onError: (error) => {
              onError(error);
              trackEvent({
                category: "payments",
                action: checkoutId ? "update-checkout" : "create-checkout",
                label: "error",
                error,
              });
            },
          },
        );
      })();
      return;
    }
    setStep((prev) => {
      if (prev === "info" && !hasDetectedExtensions) {
        return "no-detected-extensions";
      }
      if (
        (prev === "info" && hasDetectedExtensions) ||
        prev === "no-detected-extensions"
      ) {
        return "branding";
      }
      if (prev === "branding") {
        return "delivery";
      }
      if (prev === "delivery") {
        return "advanced";
      }
      return prev;
    });
  };

  const handleClose = () => {
    setStep("info");
    onClose();
    form.reset();
  };
  const handleBack = () => {
    setStep((prev) => {
      if (prev === "no-detected-extensions") {
        return "info";
      }
      if (prev === "branding") {
        return "info";
      }
      if (prev === "delivery") {
        return "branding";
      }
      if (prev === "advanced") {
        return "delivery";
      }
      return prev;
    });
  };

  return (
    <FormProvider {...form}>
      {checkoutId ? (
        <IconButton
          variant="outline"
          icon={<Icon as={BiPencil} />}
          aria-label="Edit checkout"
          onClick={onOpen}
        />
      ) : (
        <Button onClick={onOpen} colorScheme="primary">
          New Checkout Link
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent as="form">
          <ModalHeader>
            {checkoutId ? "Update" : "Create New"} Checkout
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir="column" gap={4}>
              {formInputs.map((input) => {
                if (input.step !== step) {
                  return null;
                }
                return (
                  <Flex key={input.step} flexDir="column" gap={5}>
                    {input.fields.map((field) => {
                      const foundApiKey = apiKeys.find(
                        (key) => key.key === form.watch(field.name),
                      );
                      if (!isErc1155 && field.name === "tokenId") {
                        return null;
                      }
                      return (
                        <FormControl
                          key={field.name}
                          isRequired={field.required}
                          isInvalid={
                            !!form.getFieldState(field.name, form.formState)
                              .error
                          }
                        >
                          <Flex
                            flexDir={field.sideField ? "row" : "column"}
                            alignItems={
                              field.sideField ? "center" : "flex-start"
                            }
                            justifyContent="space-between"
                          >
                            <FormLabel mb={field.sideField ? 0 : 1} py={2}>
                              {field.label}
                            </FormLabel>
                            {field.type === "textarea" ? (
                              <Textarea
                                {...form.register(field.name, {
                                  required: field.required,
                                })}
                                placeholder={field.placeholder}
                              />
                            ) : field.type === "select" ? (
                              <Select
                                borderRadius="lg"
                                w="inherit"
                                size="sm"
                                value={form.watch(field.name)}
                                onChange={(e) => {
                                  form.setValue(
                                    field.name,
                                    e.target.value as any,
                                    {
                                      shouldDirty: true,
                                    },
                                  );
                                }}
                                placeholder={field.placeholder}
                              >
                                {field.options.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </Select>
                            ) : field.type === "switch" ? (
                              <Switch
                                onChange={(e) => {
                                  form.setValue(
                                    field.name,
                                    field.name.startsWith("hide")
                                      ? !e.target.checked
                                      : e.target.checked,
                                    {
                                      shouldDirty: true,
                                    },
                                  );
                                }}
                                isChecked={
                                  field.name.startsWith("hide")
                                    ? !form.watch(field.name)
                                    : form.watch(field.name)
                                }
                              />
                            ) : field.type === "image" ? (
                              <Box w={28}>
                                <PaymentsSettingsFileUploader
                                  value={form.watch(field.name) || ""}
                                  onUpdate={(value: string) => {
                                    form.setValue(field.name, value);
                                  }}
                                />
                              </Box>
                            ) : field.type === "abiSelector" ? (
                              <PaymentsMintMethodInput
                                form={form}
                                abi={contract?.abi as Abi}
                              />
                            ) : field.type === "price" ? (
                              <Flex
                                gap={2}
                                flexDir={{ base: "column", md: "row" }}
                              >
                                <Box
                                  w={{ base: "100%", md: "50%" }}
                                  minW="70px"
                                >
                                  <PriceInput
                                    w="full"
                                    value={form.watch(
                                      "priceAndCurrencySymbol.price",
                                    )}
                                    onChange={(val) =>
                                      form.setValue(
                                        `priceAndCurrencySymbol.price`,
                                        val,
                                      )
                                    }
                                    placeholder="0"
                                  />
                                </Box>
                                <CurrencySelector
                                  value={
                                    form.watch(
                                      "priceAndCurrencySymbol.currencySymbol",
                                    ) || NATIVE_TOKEN_ADDRESS
                                  }
                                  onChange={(e) =>
                                    form.setValue(
                                      `priceAndCurrencySymbol.currencySymbol`,
                                      e.target.value,
                                    )
                                  }
                                  showCustomCurrency={false}
                                  isPaymentsSelector
                                  defaultCurrencies={
                                    contract?.chainId
                                      ? ChainIdToSupportedCurrencies[
                                          contract?.chainId
                                        ]
                                      : []
                                  }
                                />
                              </Flex>
                            ) : field.type === "clientId" ? (
                              apiKeys.length > 0 ? (
                                <ApiKeysMenu
                                  apiKeys={apiKeys}
                                  selectedKey={foundApiKey}
                                  onSelect={(val) =>
                                    form.setValue(field.name, val.key)
                                  }
                                />
                              ) : (
                                <LinkButton
                                  href="/dashboard/settings/api-keys"
                                  colorScheme="blue"
                                >
                                  Create API Key
                                </LinkButton>
                              )
                            ) : field.type === "url" ? (
                              <Input
                                type={field.type}
                                placeholder={field.placeholder}
                                value={form.watch(field.name)}
                                onBlur={(e) => {
                                  if (
                                    !/^https:\/\/[^\s$.?#].[^\s]*$/gm.test(
                                      e.target.value,
                                    ) &&
                                    e.target.value !== ""
                                  ) {
                                    form.setError(field.name, {
                                      type: "validate",
                                      message:
                                        "Invalid URL, make sure you include https://",
                                    });
                                  }
                                }}
                                onChange={(e) => {
                                  if (
                                    /^https:\/\/[^\s$.?#].[^\s]*$/gm.test(
                                      e.target.value,
                                    ) ||
                                    e.target.value === ""
                                  ) {
                                    form.clearErrors(field.name);
                                  }
                                  form.setValue(field.name, e.target.value);
                                }}
                              />
                            ) : (
                              <Input
                                {...form.register(field.name, {
                                  required: field.required,
                                })}
                                type={field.type}
                                placeholder={field.placeholder}
                              />
                            )}
                          </Flex>
                          <FormErrorMessage>
                            {form.formState.errors?.[field.name]?.message}
                          </FormErrorMessage>
                          {field.helper && (
                            <FormHelperText mt={field.sideField ? 0 : 2}>
                              {field.helper}
                            </FormHelperText>
                          )}
                        </FormControl>
                      );
                    })}
                    {input.step === "branding" && (
                      <PaymentsPreviewButton
                        isDarkMode={!!form.watch("brandDarkMode")}
                        buttonShape={
                          form.watch("brandButtonShape") || "rounded"
                        }
                        colorScheme={form.watch("brandColorScheme") || "red"}
                      />
                    )}
                  </Flex>
                );
              })}
            </Flex>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            {step !== "info" && (
              <Button type="button" onClick={handleBack} variant="ghost">
                Back
              </Button>
            )}

            <Button
              type="button"
              colorScheme="primary"
              onClick={handleNext}
              isDisabled={
                apiKeys.length === 0 ||
                !form.watch("thirdwebClientId") ||
                !form.watch("title") ||
                (isErc1155 && !form.watch("tokenId"))
              }
              isLoading={form.formState.isSubmitting || isLoading}
            >
              {step === "advanced"
                ? checkoutId
                  ? "Update"
                  : "Create"
                : "Next"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormProvider>
  );
};
