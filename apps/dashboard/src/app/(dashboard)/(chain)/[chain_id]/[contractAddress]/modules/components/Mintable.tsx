"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAddress, sendAndConfirmTransaction } from "thirdweb";
import { MintableERC721 } from "thirdweb/modules";
import { useReadContract } from "thirdweb/react";
import { z } from "zod";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";

const formSchema = z.object({
  primarySaleRecipient: z.string().refine(
    (v) => {
      // don't return isAddress(v) directly to avoid typecasting to `0x${string}`
      if (isAddress(v)) {
        return true;
      }
      return false;
    },
    {
      message: "Invalid Address",
    },
  ),
});

export type MintableModuleFormValues = z.infer<typeof formSchema>;

function MintableModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;

  const primarySaleRecipientQuery = useReadContract(
    MintableERC721.getSaleConfig,
    {
      contract: contract,
    },
  );

  const update = useCallback(
    async (values: MintableModuleFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      const setSaleConfigTx = MintableERC721.setSaleConfig({
        contract: contract,
        primarySaleRecipient: values.primarySaleRecipient,
      });

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: setSaleConfigTx,
      });
    },
    [contract, ownerAccount],
  );

  return (
    <MintableModuleUI
      {...props}
      isPending={primarySaleRecipientQuery.isPending}
      primarySaleRecipient={primarySaleRecipientQuery.data}
      update={update}
      isOwnerAccount={!!ownerAccount}
    />
  );
}

export function MintableModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    primarySaleRecipient: string | undefined;
    isPending: boolean;
    isOwnerAccount: boolean;
    update: (values: MintableModuleFormValues) => Promise<void>;
  },
) {
  const form = useForm<MintableModuleFormValues>({
    resolver: zodResolver(formSchema),
    values: {
      primarySaleRecipient: props.primarySaleRecipient || "",
    },
    reValidateMode: "onChange",
  });

  const updateMutation = useMutation({
    mutationFn: props.update,
  });

  const onSubmit = async () => {
    const promise = updateMutation.mutateAsync(form.getValues());
    toast.promise(promise, {
      success: "Successfully updated primary sale recipient",
      error: "Failed to update primary sale recipient",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ModuleCardUI
          {...props}
          updateButton={{
            isPending: updateMutation.isPending,
            isDisabled: !form.formState.isDirty,
          }}
        >
          {props.isPending && <Skeleton className="h-[74px]" />}

          {!props.isPending && (
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="primarySaleRecipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Sale Recipient</FormLabel>
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
            </div>
          )}
        </ModuleCardUI>
      </form>
    </Form>
  );
}

export default MintableModule;
