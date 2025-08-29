"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { transferBatch } from "thirdweb/extensions/erc20";
import { TransactionButton } from "@/components/tx-button";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { parseError } from "@/utils/errorParser";
import { type AirdropAddressInput, AirdropUpload } from "./airdrop-upload";

const GAS_COST_PER_ERC20_TRANSFER = 21000;

type FormValues = {
  addresses: AirdropAddressInput[];
};

export function TokenAirdropForm(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}) {
  const { contract, isLoggedIn } = props;
  const form = useForm<FormValues>({
    defaultValues: { addresses: [] },
  });

  const sendAndConfirmTx = useSendAndConfirmTx();
  const addresses = form.watch("addresses");
  // The real number should be slightly higher since there's a lil bit of overhead cost
  const estimateGasCost =
    GAS_COST_PER_ERC20_TRANSFER * (addresses || []).length;

  async function onSubmit(data: FormValues) {
    const tx = transferBatch({
      batch: data.addresses
        .filter((address) => address.quantity !== undefined)
        .map((address) => ({
          amount: address.quantity,
          to: address.address,
        })),
      contract,
    });

    const sendTxPromise = sendAndConfirmTx.mutateAsync(tx);
    toast.promise(sendTxPromise, {
      success: "Tokens airdropped successfully",
      error: (err) => ({
        message: "Failed to airdrop tokens",
        description: parseError(err),
      }),
    });

    await sendTxPromise;
  }

  if (addresses.length === 0) {
    return (
      <AirdropUpload
        client={contract.client}
        setAirdrop={(value) =>
          form.setValue("addresses", value, { shouldDirty: true })
        }
      />
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <div className="mb-5 space-y-1">
          <p className="text-base text-foreground">
            {addresses.length} addresses ready to be airdropped
          </p>

          {estimateGasCost && (
            <p className="text-muted-foreground text-sm">
              This transaction requires at least {estimateGasCost} gas. Since
              each chain has a different gas limit, please split this operation
              into multiple transactions if necessary. Usually under 10M gas is
              safe.
            </p>
          )}
        </div>

        <TransactionButton
          client={contract.client}
          isLoggedIn={isLoggedIn}
          isPending={sendAndConfirmTx.isPending}
          transactionCount={1}
          txChainID={contract.chain.id}
          type="submit"
        >
          Airdrop
        </TransactionButton>
      </div>
    </form>
  );
}
