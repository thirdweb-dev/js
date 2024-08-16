import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Alert,
  AlertIcon,
  FormControl,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { ChainIcon } from "components/icons/ChainIcon";
import type { StoredChain } from "contexts/configured-chains";
import { useAllChainsData } from "hooks/chains/allChains";
import { useSupportedChainsNameRecord } from "hooks/chains/configureChains";
import { useRemoveChainModification } from "hooks/chains/useModifyChain";
import { getDashboardChainRpc } from "lib/rpc";
import { useForm } from "react-hook-form";
import { FormErrorMessage, FormLabel } from "tw-components";
import { ChainIdInput } from "./Form/ChainIdInput";
import { ConfirmationPopover } from "./Form/ConfirmationPopover";
import { IconUpload } from "./Form/IconUpload";
import { NetworkIDInput } from "./Form/NetworkIdInput";
import { RpcInput } from "./Form/RpcInput";
import { TooltipBox } from "./Form/TooltipBox";

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
          ? getDashboardChainRpc(editingChain.chainId, editingChain)
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
    defaultValues: {
      slug: prefillSlug,
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
        chainId: Number.parseInt(data.chainId),
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
        chainId: Number.parseInt(data.chainId),
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
      variant="primary"
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

      <div className="flex flex-col gap-6 mt-6">
        {/* Chain ID + Currency Symbol */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChainIdInput form={form} disabled={!isFullyEditable} />

          {/* Currency Symbol */}
          <FormControl isRequired>
            <FormLabel>Currency Symbol</FormLabel>
            <Input
              disabled={!isFullyEditable}
              placeholder="e.g. ETH"
              autoComplete="off"
              type="text"
              {...form.register("currencySymbol", { required: true })}
            />
          </FormControl>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Testnet / Mainnet */}
          <FormControl>
            <FormLabel className="!flex gap-1 items-center">
              Network type
              <TooltipBox
                content={
                  <>
                    <span className="mb-2 block">
                      The network type indicates whether it is intended for
                      production or testing.
                    </span>

                    <span className="block">
                      It{`'`}s only used for displaying network type on the
                      dashboard and does not affect functionality.
                    </span>
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
              <div className="flex gap-4 mt-3">
                <Radio value="mainnet">Mainnet</Radio>
                <Radio value="testnet">Testnet</Radio>
              </div>
            </RadioGroup>
          </FormControl>

          {/* Icon */}
          <FormControl isInvalid={!!form.formState.errors.icon}>
            <FormLabel>Icon</FormLabel>

            <div className="flex gap-1 items-center">
              <ChainIcon size={24} ipfsSrc={form.watch("icon")} />
              <IconUpload
                onUpload={(uri) => {
                  form.setValue("icon", uri, { shouldDirty: true });
                }}
              />
            </div>
          </FormControl>
        </div>

        {editingChain?.status === "deprecated" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex mt-3 gap-4">
                  <Radio value="active">Live</Radio>
                  <Radio value="deprecated">Deprecated</Radio>
                </div>
              </RadioGroup>
            </FormControl>
          </div>
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
        <div className="flex gap-4 flex-col md:flex-row justify-end">
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
        </div>
      </div>
    </form>
  );
};
