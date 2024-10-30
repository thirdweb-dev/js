"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { sendAndConfirmTransaction } from "thirdweb";
import { RoyaltyERC721 } from "thirdweb/modules";
import { useReadContract } from "thirdweb/react";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";

export type RoyaltyInfoFormValues = {
  tokenId: number;
  recipient: string;
  bps: number;
};

export type RoyaltyModuleFormValues = Partial<RoyaltyInfoFormValues> & {
  transferValidator?: string;
};

function RoyaltyModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;

  const defaultRoyaltyInfoQuery = useReadContract(
    RoyaltyERC721.getDefaultRoyaltyInfo,
    {
      contract: contract,
    },
  );
  const transferValidatorQuery = useReadContract(
    RoyaltyERC721.getTransferValidator,
    {
      contract: contract,
    },
  );

  const setRoyaltyInfoForToken = useCallback(
    async (values: RoyaltyInfoFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      const setRoyaltyForTokenTx = RoyaltyERC721.setRoyaltyInfoForToken({
        contract: contract,
        recipient: values.recipient,
        bps: values.bps,
        tokenId: BigInt(values.tokenId),
      });

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: setRoyaltyForTokenTx,
      });
    },
    [contract, ownerAccount],
  );

  const update = useCallback(
    async (values: RoyaltyModuleFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }
      const [defaultRoyaltyRecipient, defaultRoyaltyBps] =
        defaultRoyaltyInfoQuery.data || [];

      if (
        values.recipient &&
        values.bps &&
        (values.recipient !== defaultRoyaltyRecipient ||
          values.bps !== defaultRoyaltyBps)
      ) {
        const setSaleConfigTx = RoyaltyERC721.setDefaultRoyaltyInfo({
          contract: contract,
          royaltyRecipient: values.recipient,
          royaltyBps: values.bps,
        });

        await sendAndConfirmTransaction({
          account: ownerAccount,
          transaction: setSaleConfigTx,
        });
      }

      if (
        values.transferValidator &&
        values.transferValidator !== transferValidatorQuery.data
      ) {
        const setTransferValidatorTx = RoyaltyERC721.setTransferValidator({
          contract: contract,
          validator: values.transferValidator,
        });

        await sendAndConfirmTransaction({
          account: ownerAccount,
          transaction: setTransferValidatorTx,
        });
      }
    },
    [
      contract,
      ownerAccount,
      transferValidatorQuery.data,
      defaultRoyaltyInfoQuery.data,
    ],
  );

  return (
    <RoyaltyModuleUI
      {...props}
      isPending={
        transferValidatorQuery.isPending || defaultRoyaltyInfoQuery.isPending
      }
      transferValidator={transferValidatorQuery.data}
      defaultRoyaltyInfo={defaultRoyaltyInfoQuery.data}
      update={update}
      setRoyaltyInfoForToken={setRoyaltyInfoForToken}
      isOwnerAccount={!!ownerAccount}
    />
  );
}

export function RoyaltyModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    isPending: boolean;
    isOwnerAccount: boolean;
    transferValidator: string | undefined;
    defaultRoyaltyInfo: [string, number] | undefined;
    update: (values: RoyaltyModuleFormValues) => Promise<void>;
    setRoyaltyInfoForToken: (values: RoyaltyInfoFormValues) => Promise<void>;
  },
) {
  const [defaultRoyaltyRecipient, defaultRoyaltyBps] =
    props.defaultRoyaltyInfo || [];
  const form = useForm<RoyaltyModuleFormValues>({
    values: {
      transferValidator: props.transferValidator,
      recipient: defaultRoyaltyRecipient || "",
      bps: defaultRoyaltyBps || 0,
    },
    reValidateMode: "onChange",
  });

  const setRoyaltyInfoForTokenMutation = useMutation({
    mutationFn: props.setRoyaltyInfoForToken,
  });

  const updateMutation = useMutation({
    mutationFn: props.update,
  });

  const _setRoyaltyInfoForToken = async () => {
    const promise = setRoyaltyInfoForTokenMutation.mutateAsync(
      form.getValues(),
    );
    toast.promise(promise, {
      success: "Successfully set royalty info for token",
      error: "Failed to set royalty info for token",
    });
  };

  const onSubmit = async () => {
    const promise = updateMutation.mutateAsync(form.getValues());
    toast.promise(promise, {
      success: "Successfully updated royalty info or transfer validator",
      error: "Failed to update royalty info or transfer validator",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ModuleCardUI
          {...props}
          updateButton={{
            onClick: onSubmit,
            isPending: updateMutation.isPending,
            isDisabled: !form.formState.isDirty,
          }}
        >
          {props.isPending && <Skeleton className="h-[74px]" />}

          {!props.isPending && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col gap-3">
                      <FormLabel>Default Royalty Recipient</FormLabel>
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

                <FormField
                  control={form.control}
                  name="bps"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col gap-3">
                      <FormLabel>Default Royalty BPS</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!props.isOwnerAccount} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="transferValidator"
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
          )}
        </ModuleCardUI>
      </form>
    </Form>
  );
}

export default RoyaltyModule;
