import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
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
import { MintableERC721 } from "thirdweb/modules";
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { z } from "zod";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";

const formSchema = z.object({
  primarySaleRecipient: z.string(),
  tokenId: z.string(),
  amount: z.string(),
  recipient: z.string(),
});

export type MintableModuleFormValues = z.infer<typeof formSchema>;

export function MintableModule(
  props: Omit<ModuleCardUIProps, "children"> & {
    contract: ContractOptions;
    isOwnerAccount: boolean;
  },
) {
  const { contract } = props;
  const account = useActiveAccount();
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

  async function mint(values: {
    tokenId: string;
    amount: string;
    recipient: string;
    //_uri: string,
    //_data: string,
  }) {
    const { tokenId, amount, recipient } = values;
    const grantTransaction = prepareContractCall({
      contract,
      method: "function grantRoles(address user, uint256 roles)",
      params: [account?.address || "0x0", BigInt(1)],
    });

    const grantTxResult = await sendTransaction(grantTransaction);
    console.log("grantTxResult: ", grantTxResult);

    try {
      await waitForReceipt(grantTxResult);
      toast.success("Successfully granted Roles to account");
    } catch (_) {
      toast.error("Failed to grant Roles to account");
    }
    try {
      const transaction = prepareContractCall({
        contract,
        method:
          "function mint(address to, uint256 tokenId, uint256 amount, string calldata baseURI, bytes memory data)",
        params: [recipient, BigInt(tokenId), BigInt(amount), "", "0x"],
      });

      const txResult = await sendTransaction(transaction);
      console.log("mint txResult: ", txResult);

      try {
        await waitForReceipt(txResult);
        toast.success("Successfully minted");
      } catch (_) {
        toast.error("Failed to mint");
      }
    } catch (e) {
      console.log("mint error: ", e);
    }
  }

  return (
    <MintableModuleUI
      isPending={isLoading}
      primarySaleRecipient={primarySaleRecipient || ""}
      update={update}
      mint={mint}
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
    mint: (values: {
      tokenId: string;
      amount: string;
      recipient: string;
    }) => Promise<void>;
  },
) {
  const form = useForm<MintableModuleFormValues>({
    resolver: zodResolver(formSchema),
    values: {
      primarySaleRecipient: props.primarySaleRecipient,
      tokenId: "",
      amount: "",
      recipient: "",
    },
    reValidateMode: "onChange",
  });

  const updateMutation = useMutation({
    mutationFn: props.update,
  });

  const mintMutation = useMutation({
    mutationFn: props.mint,
  });

  const onSubmit = async () => {
    const _values = form.getValues();
    const values = { ..._values };

    updateMutation.mutate(values);
  };

  const mint = () => {
    const _values = form.getValues();
    const values = { ..._values };

    mintMutation.mutate(values);
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

            <div className="h-5" />

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
                name="recipient"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col gap-3">
                    <FormLabel>Recipient</FormLabel>
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
          </div>

          <div className="h-5" />

          <div className="flex justify-end">
            <Button
              size="sm"
              className="min-w-24 gap-2"
              type="button"
              onClick={() => mint()}
              disabled={mintMutation.isPending || !props.isOwnerAccount}
            >
              {mintMutation.isPending && <Spinner className="size-4" />}
              Mint
            </Button>
          </div>
        </form>
      </Form>
    </ModuleCardUI>
  );
}
