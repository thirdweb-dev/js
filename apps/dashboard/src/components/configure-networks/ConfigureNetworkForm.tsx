import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChainIcon } from "components/icons/ChainIcon";
import { getDashboardChainRpc } from "lib/rpc";
import { CircleAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAllChainsData } from "../../hooks/chains/allChains";
import {
  type StoredChain,
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
  const { idToChain, nameToChain } = useAllChainsData();

  const form = useForm<NetworkConfigFormData>({
    values: {
      name: editingChain?.name || "",
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
      slug: editingChain?.slug || "",
    },
    defaultValues: {
      slug: prefillSlug,
    },
    mode: "onChange",
  });

  const isFullyEditable = !editingChain || editingChain?.isCustom;

  const chainId = Number(form.watch("chainId"));
  const isChainIdDirty = form.formState.dirtyFields.chainId;
  const overwritingChain = isChainIdDirty && idToChain.get(chainId);

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

        // invalid if chain found, and is not autoconfigured
        return false;
      },
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (overwritingChain) {
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
  });

  const networkNameErrorMessage =
    form.formState.errors.name &&
    (form.formState.errors.name.type === "alreadyAdded"
      ? "Network already exists"
      : "Network name is required");

  const disableSubmit = !form.formState.isDirty || !!overwritingChain;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return handleSubmit(e);
      }}
    >
      <div className="flex flex-col gap-5 mt-4 px-6 pb-6">
        {/* Name + Slug */}
        <div className="grid grid-cols-2 gap-4">
          {/* name */}
          <FormFieldSetup
            htmlFor="name"
            label="Name"
            errorMessage={networkNameErrorMessage}
            tooltip={undefined}
            isRequired
          >
            <Input
              id="name"
              autoComplete="off"
              placeholder="My Network"
              className="disabled:opacity-100 disabled:bg-muted/50 disabled:text-muted-foreground bg-muted/50"
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
            tooltip={undefined}
            htmlFor="currency-symbol"
          >
            <Input
              id="currency-symbol"
              disabled={!isFullyEditable}
              placeholder="ETH"
              autoComplete="off"
              className="disabled:opacity-100 disabled:bg-muted/50 disabled:text-muted-foreground bg-muted/50 font-mono"
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
            tooltip={undefined}
          >
            <div className="flex gap-1 items-center">
              <ChainIcon size={20} ipfsSrc={form.watch("icon")} />
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

        {overwritingChain && (
          <div className="p-3 text-sm text-destructive-text rounded-lg border border-border flex items-center gap-2">
            <CircleAlertIcon className="size-4" />
            <p>
              Chain ID {chainId} is taken by {`${overwritingChain.name}`}
            </p>
          </div>
        )}
      </div>

      {/* Buttons  */}
      <div className="flex gap-4 flex-col md:flex-row justify-end p-6 bg-muted/50 border-t border-border">
        <Button type={"submit"} disabled={disableSubmit}>
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
