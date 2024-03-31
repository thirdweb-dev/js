import { ChainIdInput } from "./Form/ChainIdInput";
import { ConfirmationPopover } from "./Form/ConfirmationPopover";
import { IconUpload } from "./Form/IconUpload";
import { NetworkIDInput } from "./Form/NetworkIdInput";
import { RpcInput } from "./Form/RpcInput";
import { TooltipBox } from "./Form/TooltipBox";
import {
  Alert,
  AlertIcon,
  Flex,
  FormControl,
  Input,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { ChainIcon } from "components/icons/ChainIcon";
import { StoredChain } from "contexts/configured-chains";
import { useAllChainsData } from "hooks/chains/allChains";
import { useSupportedChainsNameRecord } from "hooks/chains/configureChains";
import { useRemoveChainModification } from "hooks/chains/useModifyChain";
import { getDashboardChainRpc } from "lib/rpc";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, FormErrorMessage, FormLabel, Text } from "tw-components";

export type NetworkConfigFormData = {
  name: string;
  rpcUrl: string;
  chainId: string;
  currencySymbol: string;
  type: "testnet" | "mainnet";
  icon: string;
  slug: string;
  status: string;
};

// lowercase it, replace all spaces with hyphens, and then strip all non-alphanumeric characters
const nameToSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

interface NetworkConfigFormProps {
  editingChain?: StoredChain;
  prefillSlug?: string;
  prefillChainId?: string;
  prefillName?: string;
  onCustomClick?: (name: string) => void;
  onSubmit: (chain: StoredChain) => void;
}

export const ConfigureNetworkForm: React.FC<NetworkConfigFormProps> = ({
  editingChain,
  onSubmit,
  prefillSlug,
  prefillChainId,
}) => {
  const configuredChainNameRecord = useSupportedChainsNameRecord();
  const { chainIdToChainRecord } = useAllChainsData();
  const removeChainModification = useRemoveChainModification();

  const form = useForm<NetworkConfigFormData>({
    values: {
      name: editingChain?.name || "",
      rpcUrl:
        editingChain && editingChain?.status !== "deprecated"
          ? getDashboardChainRpc(editingChain)
          : "" || "",
      chainId: editingChain?.chainId
        ? `${editingChain?.chainId}`
        : "" || prefillChainId || "",
      currencySymbol: editingChain?.nativeCurrency.symbol || "",
      type: editingChain?.testnet ? "testnet" : "mainnet",
      icon: editingChain?.icon?.url || "",
      slug: editingChain?.slug || "",
      status: editingChain?.status === "deprecated" ? "deprecated" : "active",
    },
    mode: "onChange",
  });

  const isFullyEditable =
    !editingChain || editingChain?.isCustom || editingChain.isOverwritten;

  const chainId = Number(form.watch("chainId"));
  const isChainIdDirty = form.formState.dirtyFields.chainId;
  const overwritingChain = isChainIdDirty && chainIdToChainRecord[chainId];

  const editedFrom =
    editingChain?.isModified || editingChain?.isOverwritten
      ? chainIdToChainRecord[editingChain.chainId]
      : undefined;

  // setup prefills
  useEffect(() => {
    if (prefillSlug) {
      form.setValue("slug", prefillSlug, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [prefillSlug, form]);

  const { ref } = form.register("name", {
    required: true,
    validate: {
      alreadyAdded(value) {
        // return true to pass the validation, false to fail

        // ignore this validation if form is for edit screen
        if (editingChain) {
          return true;
        }

        const chain = configuredChainNameRecord[value];

        // valid if chain is not found
        if (!chain) {
          return true;
        }

        // invalid if chain found, and is not autoconfigured
        return false;
      },
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    let configuredNetwork: StoredChain;

    if (editingChain) {
      configuredNetwork = {
        ...editingChain,
        name: data.name,
        rpc: [data.rpcUrl],
        chainId: parseInt(data.chainId),
        nativeCurrency: {
          ...editingChain.nativeCurrency,
          symbol: data.currencySymbol,
        },
        icon: editingChain.icon
          ? {
              ...editingChain.icon,
              url: data.icon,
            }
          : {
              url: data.icon,
              // we don't care about these fields - adding dummy values
              width: 50,
              height: 50,
              format: "",
            },
        testnet: data.type === "testnet",
        status: data.status,
      };
    } else {
      configuredNetwork = {
        name: data.name,
        rpc: [data.rpcUrl],
        chainId: parseInt(data.chainId),
        nativeCurrency: {
          symbol: data.currencySymbol,
          name: data.currencySymbol,
          decimals: 18,
        },
        testnet: data.type === "testnet",
        shortName: form.watch("slug"),
        slug: form.watch("slug"),
        // we don't care about this field
        chain: "",
        icon: data.icon
          ? {
              url: data.icon,
              width: 50,
              height: 50,
              format: "",
            }
          : undefined,
        status: data.status,
      };
    }

    if (editingChain && editingChain.chainId !== configuredNetwork.chainId) {
      removeChainModification(editingChain.chainId);
    }

    if (overwritingChain) {
      configuredNetwork.isOverwritten = true;
      configuredNetwork.isCustom = false;
      configuredNetwork.isModified = false;
    } else {
      if (editingChain) {
        if (editingChain.isCustom) {
          configuredNetwork.isOverwritten = false;
          configuredNetwork.isCustom = true;
          configuredNetwork.isModified = false;
        } else if (editingChain.isOverwritten) {
          configuredNetwork.isOverwritten = true;
          configuredNetwork.isCustom = false;
          configuredNetwork.isModified = false;
        } else {
          configuredNetwork.isCustom = false;
          configuredNetwork.isModified = true;
          configuredNetwork.isOverwritten = false;
        }
      } else {
        configuredNetwork.isCustom = true;
        configuredNetwork.isModified = false;
        configuredNetwork.isOverwritten = false;
      }
    }

    onSubmit(configuredNetwork);
  });

  const networkNameErrorMessage =
    form.formState.errors.name &&
    (form.formState.errors.name.type === "alreadyAdded"
      ? "Network already exists"
      : "Network name is required");

  const disableSubmit = !form.formState.isDirty || !form.formState.isValid;

  const submitBtn = (
    <Button
      background="bgBlack"
      color="bgWhite"
      _hover={{
        background: "bgBlack",
      }}
      type={disableSubmit ? "submit" : overwritingChain ? "button" : "submit"}
      disabled={disableSubmit}
    >
      {editingChain ? "Update Network" : "Add Network"}
    </Button>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return handleSubmit(e);
      }}
    >
      {/* Network Name for Custom Network */}
      <FormControl isRequired isInvalid={!!networkNameErrorMessage}>
        <FormLabel>Network name</FormLabel>
        <Input
          autoComplete="off"
          placeholder="e.g. My Network"
          _placeholder={{
            fontWeight: 500,
          }}
          type="text"
          onChange={(e) => {
            const value = e.target.value;

            form.setValue("name", value, {
              shouldValidate: true,
              shouldDirty: true,
            });

            if (isFullyEditable) {
              if (!form.formState.dirtyFields.slug) {
                form.setValue("slug", nameToSlug(value), {
                  shouldValidate: true,
                });
              }
            }
          }}
          ref={ref}
        />

        <FormErrorMessage>{networkNameErrorMessage}</FormErrorMessage>
      </FormControl>

      {/* Slug URL */}
      <NetworkIDInput form={form} disabled={!isFullyEditable} />

      <Flex direction="column" gap={6} mt={6}>
        {/* Chain ID + Currency Symbol */}
        <SimpleGrid columns={{ md: 2, base: 1 }} gap={4}>
          <ChainIdInput form={form} disabled={!isFullyEditable} />

          {/* Currency Symbol */}
          <FormControl isRequired>
            <FormLabel>Currency Symbol</FormLabel>
            <Input
              disabled={!isFullyEditable}
              placeholder="e.g. ETH"
              autoComplete="off"
              _placeholder={{
                fontWeight: 500,
              }}
              type="text"
              {...form.register("currencySymbol", { required: true })}
            />
          </FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ md: 2, base: 1 }} gap={4}>
          {/* Testnet / Mainnet */}
          <FormControl>
            <FormLabel display="flex">
              Network type
              <TooltipBox
                content={
                  <>
                    <Text color="heading" display="inline-block" mb={2}>
                      {" "}
                      The network type indicates whether it is intended for
                      production or testing.
                    </Text>

                    <Text color="heading">
                      It{`'`}s only used for displaying network type on the
                      dashboard and does not affect functionality.
                    </Text>
                  </>
                }
              />
            </FormLabel>
            <RadioGroup
              onChange={(value: "testnet" | "mainnet") => {
                form.setValue("type", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              value={form.watch("type")}
            >
              <Stack direction="row" gap={4} mt={3}>
                <Radio value="mainnet">Mainnet</Radio>
                <Radio value="testnet">Testnet</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {/* Icon */}
          <FormControl isInvalid={!!form.formState.errors.icon}>
            <FormLabel>Icon</FormLabel>

            <Flex gap={3} alignItems="center">
              <ChainIcon size={24} ipfsSrc={form.watch("icon")} />
              <IconUpload
                onUpload={(uri) => {
                  form.setValue("icon", uri, { shouldDirty: true });
                }}
              />
            </Flex>
          </FormControl>
        </SimpleGrid>

        {editingChain?.status === "deprecated" && (
          <SimpleGrid columns={{ md: 2, base: 1 }} gap={4}>
            {/* Active / Deprecated */}
            <FormControl>
              <FormLabel display="flex">Network status</FormLabel>
              <RadioGroup
                onChange={(value: "active" | "deprecated") => {
                  form.setValue("status", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                value={form.watch("status")}
              >
                <Stack direction="row" gap={4} mt={3}>
                  <Radio value="active">Live</Radio>
                  <Radio value="deprecated">Deprecated</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </SimpleGrid>
        )}

        {/* RPC URL */}
        <RpcInput form={form} />

        {overwritingChain && (
          <Alert status="error" fontSize={"small"} borderRadius="md" p={3}>
            <AlertIcon />
            Chain ID {chainId} is being used by {`"${overwritingChain.name}"`}{" "}
            <br />
            Adding this network will overwrite it
          </Alert>
        )}

        {/* Buttons  */}
        <Flex
          gap={4}
          direction={{ base: "column", md: "row" }}
          justifyContent={{ base: "center", md: "flex-end" }}
        >
          {/* Add / Update Button */}
          {overwritingChain && !disableSubmit ? (
            <ConfirmationPopover
              onConfirm={handleSubmit}
              prompt="Are you sure?"
              confirmationText="Yes"
              description={
                <>
                  This action can be reversed later by resetting this network
                  {`'s`} config
                </>
              }
            >
              {submitBtn}
            </ConfirmationPopover>
          ) : (
            submitBtn
          )}

          {editedFrom && (
            <Button
              variant="outline"
              onClick={() => {
                onSubmit(editedFrom);
                removeChainModification(editedFrom.chainId);
              }}
            >
              Reset
            </Button>
          )}
        </Flex>
      </Flex>
    </form>
  );
};
