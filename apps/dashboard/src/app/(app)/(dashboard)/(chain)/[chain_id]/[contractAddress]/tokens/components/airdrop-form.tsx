"use client";

import { Button } from "chakra/button";
import { Text } from "chakra/text";
import { CircleCheckIcon, UploadIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import { transferBatch } from "thirdweb/extensions/erc20";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { TransactionButton } from "@/components/tx-button";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { type AirdropAddressInput, AirdropUpload } from "./airdrop-upload";

interface TokenAirdropFormProps {
  contract: ThirdwebContract;
  toggle?: Dispatch<SetStateAction<boolean>>;
  isLoggedIn: boolean;
}
const GAS_COST_PER_ERC20_TRANSFER = 21000;

export const TokenAirdropForm: React.FC<TokenAirdropFormProps> = ({
  contract,
  toggle,
  isLoggedIn,
}) => {
  const { handleSubmit, setValue, watch } = useForm<{
    addresses: AirdropAddressInput[];
  }>({
    defaultValues: { addresses: [] },
  });

  const sendTransaction = useSendAndConfirmTransaction();
  const addresses = watch("addresses");
  const [airdropFormOpen, setAirdropFormOpen] = useState(false);
  // The real number should be slightly higher since there's a lil bit of overhead cost
  const estimateGasCost =
    GAS_COST_PER_ERC20_TRANSFER * (addresses || []).length;

  const airdropNotifications = useTxNotifications(
    "Tokens airdropped successfully",
    "Failed to airdrop tokens",
  );

  return (
    <>
      <div className="pt-3">
        <form
          onSubmit={handleSubmit(async (data) => {
            try {
              const tx = transferBatch({
                batch: data.addresses
                  .filter((address) => address.quantity !== undefined)
                  .map((address) => ({
                    amount: address.quantity,
                    to: address.address,
                  })),
                contract,
              });
              await sendTransaction.mutateAsync(tx, {
                onError: (error) => {
                  console.error(error);
                },
                onSuccess: () => {
                  // Close the sheet/modal on success
                  if (toggle) {
                    toggle(false);
                  }
                },
              });
              airdropNotifications.onSuccess();
            } catch (err) {
              airdropNotifications.onError(err);
              console.error(err);
            }
          })}
        >
          <div className="mb-3 flex w-full flex-col gap-6 md:flex-row">
            {airdropFormOpen ? (
              <AirdropUpload
                client={contract.client}
                onClose={() => setAirdropFormOpen(false)}
                setAirdrop={(value) =>
                  setValue("addresses", value, { shouldDirty: true })
                }
              />
            ) : (
              <div className="flex flex-col gap-4 md:flex-row">
                <Button
                  borderRadius="md"
                  colorScheme="primary"
                  onClick={() => setAirdropFormOpen(true)}
                  rightIcon={<UploadIcon className="size-4" />}
                >
                  Upload addresses
                </Button>
                {addresses.length > 0 && (
                  <div className="flex flex-row items-center justify-center gap-2 text-green-500">
                    <CircleCheckIcon className="text-green-500" size={16} />
                    <Text color="inherit" size="body.sm">
                      <strong>{addresses.length} addresses</strong> ready to be
                      airdropped
                    </Text>
                  </div>
                )}
              </div>
            )}
          </div>
          {addresses?.length > 0 && !airdropFormOpen && (
            <>
              {estimateGasCost && (
                <Text>
                  This transaction requires at least {estimateGasCost} gas.
                  Since each chain has a different gas limit, please split this
                  operation into multiple transactions if necessary. Usually
                  under 10M gas is safe.
                </Text>
              )}
              <TransactionButton
                className="self-end"
                client={contract.client}
                isLoggedIn={isLoggedIn}
                isPending={sendTransaction.isPending}
                transactionCount={1}
                txChainID={contract.chain.id}
                type="submit"
              >
                Airdrop
              </TransactionButton>
            </>
          )}
        </form>
      </div>
    </>
  );
};
