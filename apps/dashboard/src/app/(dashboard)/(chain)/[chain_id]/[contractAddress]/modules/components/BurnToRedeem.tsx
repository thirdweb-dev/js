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
import {
  type ContractOptions,
  prepareContractCall,
  waitForReceipt,
} from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { z } from "zod";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";

const formSchema = z.object({
  tokenId: z.string(),
  amount: z.string(),
});

export type BurnToRedeemModuleFormValues = z.infer<typeof formSchema>;

export function BurnToRedeemModule(
  props: Omit<ModuleCardUIProps, "children"> & {
    contract: ContractOptions;
    isOwnerAccount: boolean;
  },
) {
  const { contract } = props;
  const account = useActiveAccount();
  const { mutateAsync: sendTransaction } = useSendTransaction();

  async function burnToRedeem(values: {
    tokenId: string;
    amount: string;
  }) {
    const { tokenId, amount } = values;

    const transaction = prepareContractCall({
      contract,
      method:
        "function burnToRedeem(address _from, uint256 _tokenId, uint256 _amount)",
      params: [account?.address || "0x0", BigInt(tokenId), BigInt(amount)],
    });

    const txResult = await sendTransaction(transaction);

    try {
      await waitForReceipt(txResult);
      toast.success("Successfully burned to redeem");
    } catch (_) {
      toast.error("Failed to burn to redeem");
    }
  }

  return (
    <BurnToRedeemModuleUI isPending={false} update={burnToRedeem} {...props} />
  );
}

export function BurnToRedeemModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    isPending: boolean;
    update: (values: {
      tokenId: string;
      amount: string;
    }) => Promise<void>;
  },
) {
  const form = useForm<BurnToRedeemModuleFormValues>({
    resolver: zodResolver(formSchema),
    values: {
      tokenId: "",
      amount: "",
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
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="tokenId"
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col gap-3">
                  <FormLabel>Token ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0"
                      {...field}
                      disabled={!props.isOwnerAccount}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col gap-3">
                  <FormLabel>Amount</FormLabel>
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
