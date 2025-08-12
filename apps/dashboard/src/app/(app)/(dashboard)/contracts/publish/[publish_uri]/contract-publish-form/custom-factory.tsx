import type { Abi } from "abitype";
import { PlusIcon, TrashIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCustomFactoryAbi } from "@/hooks/contract-hooks";
import { AbiSelector } from "./abi-selector";

export function CustomFactory(props: {
  setCustomFactoryAbi: Dispatch<SetStateAction<Abi>>;
  client: ThirdwebClient;
}) {
  const { setCustomFactoryAbi, client } = props;
  const form = useFormContext();

  const customFactoryAbi = useCustomFactoryAbi(
    client,
    form.watch("customFactoryAddresses[0].value"),
    form.watch("customFactoryAddresses[0].key"),
  );
  // FIXME: all of this logic needs to be reworked
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (customFactoryAbi?.data) {
      setCustomFactoryAbi(customFactoryAbi.data);
    }
  }, [customFactoryAbi, setCustomFactoryAbi]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customFactoryAddresses",
  });

  // FIXME: all of this logic needs to be reworked
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (fields.length === 0) {
      append({ key: 1, value: "" }, { shouldFocus: false });
    }
  }, [fields, append]);

  return (
    <div className="space-y-12">
      {/* Description */}
      <div className="space-y-1.5 text-sm text-muted-foreground">
        <p>
          Use this if you want to invoke your own function with custom logic
          when users deploy your contract.
        </p>

        <p>
          You need to have factory contracts pre-deployed to all networks that
          you want to support.
        </p>
      </div>

      {/* Factory contract addresses */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-1">
          Factory contract addresses
        </h2>

        <p className="text-sm text-muted-foreground mb-4">
          Paste the contract address of your factory contracts. Your contract
          can be deployed only to networks with valid factory address.
        </p>

        <div className="space-y-3 mb-5">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col lg:flex-row gap-4 lg:items-end"
            >
              <FormField
                control={form.control}
                name={`customFactoryAddresses[${index}].key`}
                render={({ field }) => (
                  <FormItem className="w-full lg:w-80 space-y-1.5">
                    <FormLabel>Network</FormLabel>
                    <SingleNetworkSelector
                      chainId={field.value}
                      disableChainId
                      className="bg-card"
                      client={client}
                      onChange={field.onChange}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`customFactoryAddresses[${index}].value`}
                render={({ field }) => (
                  <FormItem className="grow space-y-1.5">
                    <FormLabel>Factory contract address</FormLabel>
                    <FormControl>
                      <Input
                        required
                        className="bg-card"
                        {...field}
                        placeholder="0x..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="outline"
                className="rounded-full p-0 size-10 bg-card self-end"
                aria-label="Remove row"
                disabled={fields.length === 1 || form.formState.isSubmitting}
                onClick={() => remove(index)}
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        <div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-card"
            onClick={() => append({ key: "", value: "" })}
          >
            <PlusIcon className="size-5 mr-2" /> Add Network
          </Button>
        </div>
      </div>

      {/* Factory function */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-1">
          Factory function
        </h2>

        <p className="text-sm text-muted-foreground mb-4">
          Choose the factory function to deploy your contracts.
        </p>

        {customFactoryAbi?.data ? (
          <AbiSelector
            abi={customFactoryAbi.data}
            defaultValue="deployProxyByImplementation"
            onChange={(selectedFn) =>
              form.setValue(
                "factoryDeploymentData.customFactoryInput.factoryFunction",
                selectedFn,
              )
            }
            value={form.watch(
              "factoryDeploymentData.customFactoryInput.factoryFunction",
            )}
          />
        ) : (
          <p className="text-sm text-red-500 font-medium">
            Custom factory ABI not found. Please provide a valid imported
            contract on the previous step.
          </p>
        )}
      </div>
    </div>
  );
}
