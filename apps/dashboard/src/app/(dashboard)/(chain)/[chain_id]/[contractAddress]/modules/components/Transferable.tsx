import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleAlertIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ContractOptions, isAddress, waitForReceipt } from "thirdweb";
import { TransferableERC721 } from "thirdweb/modules";
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { z } from "zod";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";

const formSchema = z.object({
  allowList: z.array(
    z.object({
      address: z.string().refine(
        (v) => {
          // don't return `isAddress(v)` directly to avoid typecasting address as `0x${string}`
          if (isAddress(v)) {
            return true;
          }
          return false;
        },
        {
          message: "Invalid Address",
        },
      ),
    }),
  ),
  isRestricted: z.boolean(),
});

export type TransferableModuleFormValues = z.infer<typeof formSchema>;

export function TransferableModule(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    contract: ContractOptions;
    isOwnerAccount: boolean;
  },
) {
  const { contract } = props;
  const account = useActiveAccount();
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const { data: isTransferEnabled, isLoading } = useReadContract(
    TransferableERC721.isTransferEnabled,
    {
      contract,
    },
  );

  async function update(values: TransferableModuleFormValues) {
    // isRestricted is the opposite of transferEnabled
    const _transferEnabled = !values.isRestricted;
    if (isTransferEnabled !== _transferEnabled) {
      const setTransferableTransaction = TransferableERC721.setTransferable({
        contract,
        enableTransfer: _transferEnabled,
      });

      const setTransferableTxResult = await sendTransaction(
        setTransferableTransaction,
      );

      try {
        await waitForReceipt(setTransferableTxResult);
        toast.success("Successfully updated transfer enabled flag");
      } catch (_) {
        toast.error("Failed to update transfer enabled flag");
      }
    }

    await Promise.allSettled(
      values.allowList.map(async (allowlistedAddress) => {
        const setTransferableForTransaction =
          TransferableERC721.setTransferableFor({
            contract,
            enableTransfer: true,
            target: allowlistedAddress.address,
          });

        const setTransferableForTxResult = await sendTransaction(
          setTransferableForTransaction,
        );

        try {
          await waitForReceipt(setTransferableForTxResult);
          toast.success("Successfully updated transfer restrictions");
        } catch (_e) {
          toast.error("Failed to update transfer restrictions");
        }
      }),
    );
  }

  return (
    <TransferableModuleUI
      isPending={isLoading}
      isRestricted={isLoading ? false : !isTransferEnabled}
      adminAddress={account?.address || ""}
      update={update}
      {...props}
    />
  );
}

export function TransferableModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    // allowList: string[]; // TODO: add this back in when we have a way to get the list of addresses
    isRestricted: boolean;
    isPending: boolean;
    adminAddress: string;
    isOwnerAccount: boolean;
    update: (values: TransferableModuleFormValues) => Promise<void>;
  },
) {
  const form = useForm<TransferableModuleFormValues>({
    resolver: zodResolver(formSchema),
    values: {
      allowList: [],
      isRestricted: props.isRestricted,
    },
    reValidateMode: "onChange",
  });

  const updateMutation = useMutation({
    mutationFn: props.update,
  });

  const formFields = useFieldArray({
    control: form.control,
    name: "allowList",
  });

  const onSubmit = async () => {
    const _values = form.getValues();
    const values = { ..._values };

    // clear the allowlist if no restrictions
    if (!_values.isRestricted) {
      values.allowList = [];
    }

    updateMutation.mutate(values);
  };

  const isRestricted = form.watch("isRestricted");

  if (props.isPending) {
    return <Skeleton className="h-36" />;
  }

  return (
    <ModuleCardUI
      {...props}
      updateButton={{
        onClick: onSubmit,
        isPending: updateMutation.isPending,
        isDisabled: !form.formState.isDirty,
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center gap-4">
            {/* Switch */}
            <FormField
              control={form.control}
              name="isRestricted"
              render={({ field }) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { value, ...restField } = field;

                return (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>Restrict Transfers</FormLabel>
                    <FormControl>
                      <Switch
                        {...restField}
                        checked={field.value}
                        disabled={!props.isOwnerAccount}
                        className="!m-0"
                        onCheckedChange={(v) => {
                          field.onChange(v);

                          // if enabling restrictions and allowlist is empty, add the admin address by default
                          if (v === true && formFields.fields.length === 0) {
                            formFields.append({
                              address: props.adminAddress || "",
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="h-3" />

          {isRestricted && (
            <div className="w-full">
              {/* Warning  */}
              {formFields.fields.length === 0 ? (
                <Alert variant="warning">
                  <CircleAlertIcon className="size-5 max-sm:hidden" />
                  <AlertTitle className="max-sm:!pl-0">
                    Nobody has permission to transfer tokens on this contract
                  </AlertTitle>
                </Alert>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Addresses */}
                  {formFields.fields.map((fieldItem, index) => (
                    <div className="flex items-start gap-3" key={fieldItem.id}>
                      <FormField
                        control={form.control}
                        name={`allowList.${index}.address`}
                        render={({ field }) => (
                          <FormItem className="grow">
                            <FormControl>
                              <Input
                                placeholder="0x..."
                                {...field}
                                disabled={!props.isOwnerAccount}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <ToolTipLabel label="Remove address">
                        <Button
                          variant="outline"
                          className="!text-destructive-text bg-background"
                          onClick={() => {
                            formFields.remove(index);
                          }}
                          disabled={!props.isOwnerAccount}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </ToolTipLabel>
                    </div>
                  ))}
                </div>
              )}

              <div className="h-3" />

              {/* Add Addresses Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // add admin by default if adding the first input
                    formFields.append({
                      address:
                        formFields.fields.length === 0
                          ? props.adminAddress
                          : "",
                    });
                  }}
                  className="gap-2"
                  disabled={!props.isOwnerAccount}
                >
                  <PlusIcon className="size-3" />
                  Add Address
                </Button>
              </div>
            </div>
          )}

          {!isRestricted && (
            <Alert variant="info">
              <CircleAlertIcon className="size-5 max-sm:hidden" />
              <AlertTitle className="max-sm:!pl-0">
                Transferring tokens in this contract is not restricted. Everyone
                is free to transfer their tokens.
              </AlertTitle>
            </Alert>
          )}
        </form>
      </Form>
    </ModuleCardUI>
  );
}
