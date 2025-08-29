"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import {
  getPlatformFeeInfo,
  setPlatformFeeInfo,
} from "thirdweb/extensions/common";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import z from "zod";
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
import { AddressOrEnsSchema, BasisPointsSchema } from "@/schema/schemas";
import type { ExtensionDetectedState } from "@/types/ExtensionDetectedState";
import { parseError } from "@/utils/errorParser";
import { SettingDetectedState } from "./detected-state";

// @internal
const CommonPlatformFeeSchema = z.object({
  /**
   * platform fee basis points
   */
  platform_fee_basis_points: BasisPointsSchema,
  /**
   * platform fee recipient address
   */
  platform_fee_recipient: AddressOrEnsSchema,
});

export function SettingsPlatformFees({
  contract,
  detectedState,
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
  isLoggedIn: boolean;
}) {
  const address = useActiveAccount()?.address;
  const sendAndConfirmTx = useSendAndConfirmTx();
  const platformFeesQuery = useReadContract(getPlatformFeeInfo, { contract });
  const platformFeeInfo = platformFeesQuery.data
    ? {
        platform_fee_basis_points: platformFeesQuery.data[1],
        platform_fee_recipient: platformFeesQuery.data[0],
      }
    : undefined;

  const form = useForm<z.input<typeof CommonPlatformFeeSchema>>({
    defaultValues: platformFeeInfo,
    resolver: zodResolver(CommonPlatformFeeSchema),
    values: platformFeeInfo,
  });

  return (
    <div className="relative overflow-hidden bg-card border rounded-lg">
      <SettingDetectedState detectedState={detectedState} type="platformFee" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            const transaction = setPlatformFeeInfo({
              contract,
              platformFeeBps: BigInt(data.platform_fee_basis_points),
              platformFeeRecipient: data.platform_fee_recipient,
            });
            sendAndConfirmTx.mutate(transaction, {
              onError: (error) => {
                toast.error("Error updating platform fee settings", {
                  description: parseError(error),
                });
                console.error(error);
              },
              onSuccess: () => {
                form.reset(data);
                toast.success("Platform fee settings updated");
              },
            });
          })}
        >
          <div className="p-4 md:p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold tracking-tight">
                Platform fee
              </h3>
              <p className="text-muted-foreground text-sm">
                The wallet address that should receive the revenue from platform
                fees
              </p>
            </div>

            {platformFeesQuery.isPending ? (
              <Skeleton className="h-[74px] w-full" />
            ) : (
              <div className="flex flex-col lg:flex-row gap-4 w-full">
                <FormField
                  control={form.control}
                  name="platform_fee_recipient"
                  render={({ field }) => (
                    <FormItem className="grow max-w-md">
                      <FormLabel>Recipient Address</FormLabel>
                      <FormControl>
                        <SolidityInput
                          client={contract.client}
                          formContext={form}
                          className="bg-background"
                          solidityType="address"
                          disabled={!address || sendAndConfirmTx.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="platform_fee_basis_points"
                  render={() => (
                    <FormItem className="md:max-w-[200px]">
                      <FormLabel>Percentage</FormLabel>
                      <FormControl>
                        <BasisPointsInput
                          disabled={sendAndConfirmTx.isPending}
                          onChange={(value) =>
                            form.setValue("platform_fee_basis_points", value, {
                              shouldValidate: true,
                            })
                          }
                          value={form.watch("platform_fee_basis_points")}
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
                variant="default"
                size="sm"
                client={contract.client}
                disabled={!form.formState.isDirty}
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
