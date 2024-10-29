import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ContractOptions, waitForReceipt } from "thirdweb";
import { MintableERC721 } from "thirdweb/modules";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { z } from "zod";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";

const formSchema = z.object({
  primarySaleRecipient: z.string(),
});

export type MintableModuleFormValues = z.infer<typeof formSchema>;

export function MintableModule(
  props: Omit<ModuleCardUIProps, "children"> & {
    contract: ContractOptions;
    isOwnerAccount: boolean;
  },
) {
  const { contract } = props;
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const { data: primarySaleRecipient, isLoading } = useReadContract(
    MintableERC721.getSaleConfig,
    {
      contract,
    },
  );

  async function update(values: MintableModuleFormValues) {
    const setSaleConfigTransaction = MintableERC721.setSaleConfig({
      contract,
      primarySaleRecipient: values.primarySaleRecipient,
    });

    const setSaleConfigTxResult = await sendTransaction(
      setSaleConfigTransaction,
    );

    try {
      await waitForReceipt(setSaleConfigTxResult);
      toast.success("Successfully updated primary sale recipient");
    } catch (_) {
      toast.error("Failed to update the primary sale recipient");
    }
  }

  return (
    <MintableModuleUI
      isPending={isLoading}
      primarySaleRecipient={primarySaleRecipient || ""}
      update={update}
      {...props}
    />
  );
}

export function MintableModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    primarySaleRecipient: string;
    isPending: boolean;
    isOwnerAccount: boolean;
    update: (values: MintableModuleFormValues) => Promise<void>;
  },
) {
  const form = useForm<MintableModuleFormValues>({
    resolver: zodResolver(formSchema),
    values: {
      primarySaleRecipient: props.primarySaleRecipient,
    },
    reValidateMode: "onChange",
  });

  const updateMutation = useMutation({
    mutationFn: props.update,
  });

  const onSubmit = async () => {
    const _values = form.getValues();
    const values = { ..._values };

    updateMutation.mutate(values);
  };

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
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="primarySaleRecipient"
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col gap-3">
                  <FormLabel>Primary Sale Recipient</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0x..."
                      {...field}
                      disabled={!props.isOwnerAccount}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </ModuleCardUI>
  );
}
