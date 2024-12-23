import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStore } from "@/lib/reactive";
import { ChainIcon } from "components/icons/ChainIcon";
import { getDashboardChainRpc } from "lib/rpc";
import { CircleAlertIcon, Trash2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAllChainsData } from "../../hooks/chains/allChains";
import {
  type StoredChain,
  chainOverridesStore,
  removeChainOverrides,
} from "../../stores/chainStores";
import { ChainIdInput } from "./Form/ChainIdInput";
import { IconUpload } from "./Form/IconUpload";
import { NetworkIDInput } from "./Form/NetworkIdInput";
import { RpcInput } from "./Form/RpcInput";

export type NetworkConfigFormData = {
  name: string;
  rpcUrl: string;
  chainId: string;
  currencySymbol: string;
  type: "testnet" | "mainnet";
  icon: string;
  slug: string;
  stackType?: string;
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

const maxAllowedChainOverrides = 10;

export const ConfigureNetworkForm: React.FC<NetworkConfigFormProps> = ({
  editingChain,
  onSubmit,
  prefillSlug,
  prefillChainId,
}) => {
  const { idToChain, nameToChain } = useAllChainsData();
  const chainOverrides = useStore(chainOverridesStore);

  const form = useForm<NetworkConfigFormData>({
    values: {
      name: editingChain?.name || prefillSlug || "",
      rpcUrl:
        editingChain && editingChain?.status !== "deprecated"
          ? getDashboardChainRpc(editingChain.chainId, editingChain)
          : "",
      chainId: editingChain?.chainId
        ? `${editingChain?.chainId}`
        : prefillChainId || "",
      currencySymbol: editingChain?.nativeCurrency.symbol || "",
      type: editingChain?.testnet ? "testnet" : "mainnet",
      icon: editingChain?.icon?.url || "",
      slug: prefillSlug || editingChain?.slug || "",
      stackType: "",
    },
    mode: "onChange",
  });

  const isFullyEditable = !editingChain || editingChain?.isCustom;

  const chainId = Number(form.watch("chainId"));
  const isChainIdDirty = form.formState.dirtyFields.chainId;
  const existingChain = idToChain.get(chainId);

  const isOverwriting =
    isChainIdDirty &&
    // if adding a custom chain, (editingChain === undefined)
    !editingChain &&
    // found a chain with same chainId
    existingChain;

  const editedFrom = editingChain?.isModified
    ? idToChain.get(editingChain.chainId)
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

        const chain = nameToChain.get(value);

        // valid if chain is not found
        if (!chain) {
          return true;
        }

        // invalid if chain found, and is not auto configured
        return false;
      },
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (isOverwriting) {
      return;
    }

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
        stackType: data.stackType || "",
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
        stackType: data.stackType || "",
      };
    }

    if (editingChain && editingChain.chainId !== configuredNetwork.chainId) {
      removeChainOverrides(editingChain.chainId);
    }

    if (editingChain) {
      if (editingChain.isCustom) {
        configuredNetwork.isCustom = true;
        configuredNetwork.isModified = false;
      } else {
        configuredNetwork.isCustom = false;
        configuredNetwork.isModified = true;
      }
    } else {
      configuredNetwork.isCustom = true;
      configuredNetwork.isModified = false;
    }
    onSubmit(configuredNetwork);
    form.reset();
  });

  const networkNameErrorMessage =
    form.formState.errors.name &&
    (form.formState.errors.name.type === "alreadyAdded"
      ? "Network already exists"
      : "Network name is required");

  const disableSubmit = !form.formState.isDirty || !!isOverwriting;

  // This is just a temporary UI while we store the chain overrides in cookies
  // TODO - delete this once we have the chain overrides in API
  if (chainOverrides.length >= maxAllowedChainOverrides) {
    return (
      <div className="mt-2 flex flex-col px-6 pb-6">
        <p className="mb-3 text-muted-foreground">
          <span className="block">Too many chain overrides configured.</span>
          You can only configure up to{" "}
          <span className="font-bold">{maxAllowedChainOverrides}</span> chain
          overrides. Remove existing overrides to add more.
        </p>
        <ScrollShadow scrollableClassName="max-h-[400px]">
          <div className="flex flex-col gap-3">
            {chainOverrides.map((c) => {
              return (
                <div
                  className="flex items-center justify-between gap-2 rounded-lg border border-border px-4 py-2"
                  key={c.chainId}
                >
                  <div>
                    <p>{c.name}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeChainOverrides(c.chainId)}
                  >
                    <Trash2Icon className="size-4 text-destructive-text" />
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollShadow>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return handleSubmit(e);
      }}
    >
      <div className="mt-4 flex flex-col gap-5 px-6 pb-6">
        {/* Name + Slug */}
        <div className="grid grid-cols-2 gap-4">
          {/* name */}
          <FormFieldSetup
            htmlFor="name"
            label="Name"
            errorMessage={networkNameErrorMessage}
            isRequired
          >
            <Input
              id="name"
              autoComplete="off"
              placeholder="My Network"
              className="bg-muted/50 disabled:bg-muted/50 disabled:text-muted-foreground disabled:opacity-100"
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
          </FormFieldSetup>

          {/* Slug */}
          <NetworkIDInput form={form} disabled={!isFullyEditable} />
        </div>

        {/* Chain ID + Currency Symbol */}
        <div className="grid grid-cols-2 gap-4">
          <ChainIdInput form={form} disabled={!isFullyEditable} />

          {/* Currency Symbol */}
          <FormFieldSetup
            isRequired
            label="Currency Symbol"
            errorMessage={form.formState.errors.currencySymbol?.message}
            htmlFor="currency-symbol"
          >
            <Input
              id="currency-symbol"
              disabled={!isFullyEditable}
              placeholder="ETH"
              autoComplete="off"
              className="bg-muted/50 font-mono disabled:bg-muted/50 disabled:text-muted-foreground disabled:opacity-100"
              type="text"
              {...form.register("currencySymbol", { required: true })}
            />
          </FormFieldSetup>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Testnet / Mainnet */}
          <FormFieldSetup
            htmlFor="network-type"
            errorMessage={undefined}
            isRequired
            label="Type"
            tooltip={
              <span>
                <span className="mb-2 block">
                  The network type indicates whether it is intended for
                  production or testing.
                </span>

                <span className="block">
                  It{`'`}s only used for displaying network type on the
                  dashboard and does not affect functionality.
                </span>
              </span>
            }
          >
            <RadioGroup
              id="network-type"
              value={form.watch("type")}
              onValueChange={(v) => {
                form.setValue("type", v === "testnet" ? "testnet" : "mainnet", {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="mainnet" id="mainnet" />
                <Label htmlFor="mainnet">Mainnet</Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="testnet" id="testnet" />
                <Label htmlFor="testnet">Testnet</Label>
              </div>
            </RadioGroup>
          </FormFieldSetup>

          {/* Icon */}
          <FormFieldSetup
            isRequired={false}
            errorMessage={form.formState.errors.icon?.message}
            htmlFor="network-icon"
            label="Icon"
          >
            <div className="flex items-center gap-1">
              <ChainIcon className="size-5" ipfsSrc={form.watch("icon")} />
              <IconUpload
                onUpload={(uri) => {
                  form.setValue("icon", uri, { shouldDirty: true });
                }}
              />
            </div>
          </FormFieldSetup>
        </div>

        {/* RPC URL */}
        <RpcInput form={form} />

        {isOverwriting && existingChain && (
          <div className="flex items-center gap-2 rounded-lg border border-border p-3 text-destructive-text text-sm">
            <CircleAlertIcon className="size-4" />
            <p>
              Chain ID {chainId} is taken by {`${existingChain.name}`}
            </p>
          </div>
        )}
      </div>

      {/* Buttons  */}
      <div className="flex flex-col justify-end gap-4 border-border border-t bg-muted/50 p-6 md:flex-row">
        <Button type="submit" disabled={disableSubmit}>
          {editingChain ? "Update Network" : "Add Network"}
        </Button>

        {editedFrom && (
          <Button
            variant="outline"
            onClick={() => {
              onSubmit(editedFrom);
              removeChainOverrides(editedFrom.chainId);
            }}
          >
            Reset
          </Button>
        )}
      </div>
    </form>
  );
};
