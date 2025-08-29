"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import {
  primarySaleRecipient,
  setPrimarySaleRecipient,
} from "thirdweb/extensions/common";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { z } from "zod";
import { AdminOnly } from "@/components/contracts/roles/admin-only";
import { SolidityInput } from "@/components/solidity-inputs";
import { TransactionButton } from "@/components/tx-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { AddressOrEnsSchema } from "@/schema/schemas";
import type { ExtensionDetectedState } from "@/types/ExtensionDetectedState";
import { parseError } from "@/utils/errorParser";
import { SettingDetectedState } from "./detected-state";

const CommonPrimarySaleSchema = z.object({
  primary_sale_recipient: AddressOrEnsSchema.default(ZERO_ADDRESS),
});

export const SettingsPrimarySale = ({
  contract,
  detectedState,
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
  isLoggedIn: boolean;
}) => {
  const address = useActiveAccount()?.address;

  const query = useReadContract(primarySaleRecipient, {
    contract,
  });
  const sendAndConfirmTx = useSendAndConfirmTx();

  const transformedQueryData = {
    primary_sale_recipient: query.data,
  };

  const form = useForm<z.input<typeof CommonPrimarySaleSchema>>({
    defaultValues: transformedQueryData,
    resolver: zodResolver(CommonPrimarySaleSchema),
    values: transformedQueryData,
  });

  const onSubmit = (data: z.input<typeof CommonPrimarySaleSchema>) => {
    const saleRecipient = data.primary_sale_recipient;
    if (!saleRecipient) {
      return toast.error("Please enter a valid primary sale recipient address");
    }
    const transaction = setPrimarySaleRecipient({
      contract,
      saleRecipient,
    });

    sendAndConfirmTx.mutate(transaction, {
      onError: (error) => {
        toast.error("Error updating primary sale address", {
          description: parseError(error),
        });
        console.error(error);
      },
      onSuccess: () => {
        toast.success("Primary sale address updated");
      },
    });
  };

  return (
    <div className="relative bg-card border rounded-lg">
      <SettingDetectedState detectedState={detectedState} type="primarySale" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-4 md:p-6">
            {/* header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">
                Primary Sales
              </h2>
              <p className="text-muted-foreground text-sm">
                The wallet address that should receive the revenue from initial
                sales of the assets
              </p>
            </div>

            {query.isPending ? (
              <Skeleton className="h-[74px] w-full" />
            ) : (
              <FormField
                control={form.control}
                name="primary_sale_recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Address</FormLabel>
                    <FormControl>
                      <SolidityInput
                        client={contract.client}
                        disabled={!address}
                        formContext={form}
                        solidityType="address"
                        className="max-w-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <AdminOnly contract={contract}>
            <div className="px-4 lg:px-6 py-3 border-t border-dashed flex justify-end">
              <TransactionButton
                client={contract.client}
                disabled={query.isPending}
                isLoggedIn={isLoggedIn}
                isPending={sendAndConfirmTx.isPending}
                transactionCount={undefined}
                txChainID={contract.chain.id}
                type="submit"
                variant="default"
                size="sm"
              >
                Save
              </TransactionButton>
            </div>
          </AdminOnly>
        </form>
      </Form>
    </div>
  );
};
