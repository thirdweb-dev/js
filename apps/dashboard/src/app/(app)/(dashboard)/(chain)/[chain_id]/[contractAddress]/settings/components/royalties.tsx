"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import {
  getDefaultRoyaltyInfo,
  setDefaultRoyaltyInfo,
} from "thirdweb/extensions/common";
import { useActiveAccount, useReadContract } from "thirdweb/react";

import { z } from "zod";
import { BasisPointsInput } from "@/components/blocks/BasisPointsInput";
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
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { AddressOrEnsSchema, BasisPointsSchema } from "@/schema/schemas";
import type { ExtensionDetectedState } from "@/types/ExtensionDetectedState";
import { SettingDetectedState } from "./detected-state";

/**
 * @internal
 */
const CommonRoyaltySchema = z.object({
  /**
   * The address of the royalty recipient. All royalties will be sent
   * to this address.
   * @internal
   * @remarks used by OpenSea "fee_recipient"
   */
  fee_recipient: AddressOrEnsSchema,
  /**
   * The amount of royalty collected on all royalties represented as basis points.
   * The default is 0 (no royalties).
   *
   * 1 basis point = 0.01%
   *
   * For example: if this value is 100, then the royalty is 1% of the total sales.
   *
   * @internal
   * @remarks used by OpenSea "seller_fee_basis_points"
   */
  seller_fee_basis_points: BasisPointsSchema,
});

export function SettingsRoyalties({
  contract,
  detectedState,
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
  isLoggedIn: boolean;
}) {
  const query = useReadContract(getDefaultRoyaltyInfo, {
    contract,
  });
  const royaltyInfo = query.data
    ? { fee_recipient: query.data[0], seller_fee_basis_points: query.data[1] }
    : undefined;
  const sendAndConfirmTx = useSendAndConfirmTx();
  const form = useForm<z.input<typeof CommonRoyaltySchema>>({
    defaultValues: royaltyInfo,
    resolver: zodResolver(CommonRoyaltySchema),
    values: royaltyInfo,
  });

  const address = useActiveAccount()?.address;

  const { onSuccess, onError } = useTxNotifications(
    "Royalty settings updated",
    "Error updating royalty settings",
    contract,
  );

  return (
    <div className="relative overflow-hidden bg-card border rounded-lg">
      <SettingDetectedState detectedState={detectedState} type="royalties" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((d) => {
            const transaction = setDefaultRoyaltyInfo({
              contract,
              royaltyBps: BigInt(d.seller_fee_basis_points),
              royaltyRecipient: d.fee_recipient,
            });
            sendAndConfirmTx.mutate(transaction, {
              onError: (error) => {
                console.error(error);
                onError(error);
              },
              onSuccess: () => {
                form.reset(d);
                onSuccess();
              },
            });
          })}
        >
          <div className="p-4 md:p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold tracking-tight">
                Royalties
              </h3>
              <p className="text-sm text-muted-foreground">
                The wallet address that should receive the revenue from
                royalties earned from secondary sales of the assets.
              </p>
            </div>

            {query.isPending ? (
              <Skeleton className="h-[74px] w-full" />
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="fee_recipient"
                  render={({ field }) => (
                    <FormItem className="flex-1 max-w-md">
                      <FormLabel>Recipient Address</FormLabel>
                      <FormControl>
                        <SolidityInput
                          client={contract.client}
                          formContext={form}
                          solidityType="address"
                          {...field}
                          disabled={!address}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seller_fee_basis_points"
                  render={() => (
                    <FormItem className="md:max-w-[200px]">
                      <FormLabel>Percentage</FormLabel>
                      <FormControl>
                        <BasisPointsInput
                          onChange={(value) =>
                            form.setValue("seller_fee_basis_points", value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          value={form.watch("seller_fee_basis_points")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <AdminOnly contract={contract}>
            <div className="p-4 lg:px-6 py-3 border-t border-dashed flex justify-end">
              <TransactionButton
                client={contract.client}
                size="sm"
                variant="default"
                disabled={query.isPending || !form.formState.isDirty}
                isLoggedIn={isLoggedIn}
                isPending={sendAndConfirmTx.isPending}
                transactionCount={undefined}
                txChainID={contract.chain.id}
                type="submit"
              >
                Save
              </TransactionButton>
            </div>
          </AdminOnly>
        </form>
      </Form>
    </div>
  );
}
