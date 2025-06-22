import { CircleAlertIcon, Trash2Icon } from "lucide-react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { ChainIconClient } from "@/icons/ChainIcon";
import { useStore } from "@/lib/reactive";
import { getDashboardChainRpc } from "@/lib/rpc";
import {
  chainOverridesStore,
  removeChainOverrides,
  type StoredChain,
} from "@/stores/chainStores";
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
  client: ThirdwebClient;
}

const maxAllowedChainOverrides = 10;

export const ConfigureNetworkForm: React.FC<NetworkConfigFormProps> = ({
  editingChain,
  onSubmit,
  prefillSlug,
  prefillChainId,
  client,
}) => {
  const { idToChain, nameToChain } = useAllChainsData();
  const chainOverrides = useStore(chainOverridesStore);
  const currencySymbolId = useId();
  const nameId = useId();
  const networkTypeId = useId();
  const form = useForm<NetworkConfigFormData>({
    mode: "onChange",
    values: {
      chainId: editingChain?.chainId
        ? `${editingChain?.chainId}`
        : prefillChainId || "",
      currencySymbol: editingChain?.nativeCurrency.symbol || "",
      icon: editingChain?.icon?.url || "",
      name: editingChain?.name || prefillSlug || "",
      rpcUrl:
        (!editingChain || editingChain.status === "deprecated"
          ? ""
          : // if chain is custom or modified, show the rpc as is
            editingChain.isCustom || editingChain.isModified
            ? editingChain.rpc[0]
            : getDashboardChainRpc(
                editingChain.chainId,
                editingChain,
                client,
              )) || "",
      slug: prefillSlug || editingChain?.slug || "",
      stackType: "",
      type: editingChain?.testnet ? "testnet" : "mainnet",
    },
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
        chainId: Number.parseInt(data.chainId),
        icon: editingChain.icon
          ? {
              ...editingChain.icon,
              url: data.icon,
            }
          : {
              format: "",
              height: 50,
              url: data.icon,
              // we don't care about these fields - adding dummy values
              width: 50,
            },
        name: data.name,
        nativeCurrency: {
          ...editingChain.nativeCurrency,
          symbol: data.currencySymbol,
        },
        rpc: [data.rpcUrl],
        stackType: data.stackType || "",
        testnet: data.type === "testnet",
      };
    } else {
      configuredNetwork = {
        // we don't care about this field
        chain: "",
        chainId: Number.parseInt(data.chainId),
        icon: data.icon
          ? {
              format: "",
              height: 50,
              url: data.icon,
              width: 50,
            }
          : undefined,
        name: data.name,
        nativeCurrency: {
          decimals: 18,
          name: data.currencySymbol,
          symbol: data.currencySymbol,
        },
        rpc: [data.rpcUrl],
        shortName: form.watch("slug"),
        slug: form.watch("slug"),
        stackType: data.stackType || "",
        testnet: data.type === "testnet",
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
                    onClick={() => removeChainOverrides(c.chainId)}
                    size="icon"
                    variant="ghost"
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
            errorMessage={networkNameErrorMessage}
            htmlFor={nameId}
            isRequired
            label="Name"
          >
            <Input
              autoComplete="off"
              className="bg-card disabled:bg-card disabled:text-muted-foreground disabled:opacity-100"
              id={nameId}
              onChange={(e) => {
                const value = e.target.value;

                form.setValue("name", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });

                if (isFullyEditable) {
                  if (!form.formState.dirtyFields.slug) {
                    form.setValue("slug", nameToSlug(value), {
                      shouldValidate: true,
                    });
                  }
                }
              }}
              placeholder="My Network"
              ref={ref}
              type="text"
            />
          </FormFieldSetup>

          {/* Slug */}
          <NetworkIDInput disabled={!isFullyEditable} form={form} />
        </div>

        {/* Chain ID + Currency Symbol */}
        <div className="grid grid-cols-2 gap-4">
          <ChainIdInput disabled={!isFullyEditable} form={form} />

          {/* Currency Symbol */}
          <FormFieldSetup
            errorMessage={form.formState.errors.currencySymbol?.message}
            htmlFor={currencySymbolId}
            isRequired
            label="Currency Symbol"
          >
            <Input
              autoComplete="off"
              className="bg-card font-mono disabled:bg-card disabled:text-muted-foreground disabled:opacity-100"
              disabled={!isFullyEditable}
              id={currencySymbolId}
              placeholder="ETH"
              type="text"
              {...form.register("currencySymbol", { required: true })}
            />
          </FormFieldSetup>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Testnet / Mainnet */}
          <FormFieldSetup
            errorMessage={undefined}
            htmlFor={networkTypeId}
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
              className="flex gap-4"
              id={networkTypeId}
              onValueChange={(v) => {
                form.setValue("type", v === "testnet" ? "testnet" : "mainnet", {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              value={form.watch("type")}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="mainnet" />
                <Label htmlFor="mainnet">Mainnet</Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="testnet" />
                <Label htmlFor="testnet">Testnet</Label>
              </div>
            </RadioGroup>
          </FormFieldSetup>

          {/* Icon */}
          <FormFieldSetup
            errorMessage={form.formState.errors.icon?.message}
            isRequired={false}
            label="Icon"
          >
            <div className="flex items-center gap-1">
              <ChainIconClient
                className="size-5"
                client={client}
                src={form.watch("icon")}
              />
              <IconUpload
                client={client}
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
      <div className="flex flex-col justify-end gap-4 border-border border-t bg-card p-6 md:flex-row">
        <Button disabled={disableSubmit} type="submit">
          {editingChain ? "Update Network" : "Add Network"}
        </Button>

        {editedFrom && (
          <Button
            onClick={() => {
              onSubmit(editedFrom);
              removeChainOverrides(editedFrom.chainId);
            }}
            variant="outline"
          >
            Reset
          </Button>
        )}
      </div>
    </form>
  );
};
