import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { CircleCheck, Upload } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { transferBatch } from "thirdweb/extensions/erc20";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { Button, Text } from "tw-components";
import {
  AirdropUploadERC20,
  type ERC20AirdropAddressInput,
} from "./airdrop-upload-erc20";
interface TokenAirdropFormProps {
  contract: ThirdwebContract;
  toggle?: Dispatch<SetStateAction<boolean>>;
}
const GAS_COST_PER_ERC20_TRANSFER = 21000;

export const TokenAirdropForm: React.FC<TokenAirdropFormProps> = ({
  contract,
  toggle,
}) => {
  const { handleSubmit, setValue, watch } = useForm<{
    addresses: ERC20AirdropAddressInput[];
  }>({
    defaultValues: { addresses: [] },
  });
  const trackEvent = useTrack();
  const sendTransaction = useSendAndConfirmTransaction();
  const addresses = watch("addresses");
  const [airdropFormOpen, setAirdropFormOpen] = useState(false);
  // The real number should be slightly higher since there's a lil bit of overhead cost
  const estimateGasCost =
    GAS_COST_PER_ERC20_TRANSFER * (addresses || []).length;
  return (
    <>
      <div className="pt-3">
        <form
          onSubmit={handleSubmit((data) => {
            trackEvent({
              category: "token",
              action: "airdrop",
              label: "attempt",
              contractAddress: contract.address,
            });
            const tx = transferBatch({
              contract,
              batch: data.addresses
                .filter((address) => address.quantity !== undefined)
                .map((address) => ({
                  to: address.address,
                  amount: address.quantity,
                })),
            });
            const promise = sendTransaction.mutateAsync(tx, {
              onSuccess: () => {
                trackEvent({
                  category: "token",
                  action: "airdrop",
                  label: "success",
                  contract_address: contract.address,
                });
                // Close the sheet/modal on success
                if (toggle) {
                  toggle(false);
                }
              },
              onError: (error) => {
                trackEvent({
                  category: "token",
                  action: "airdrop",
                  label: "success",
                  contract_address: contract.address,
                  error,
                });
                console.error(error);
              },
            });
            toast.promise(promise, {
              loading: "Airdropping tokens",
              success: "Tokens airdropped successfully",
              error: "Failed to airdrop tokens",
            });
          })}
        >
          <div className="flex flex-col md:flex-row w-full gap-6 mb-3">
            {airdropFormOpen ? (
              <AirdropUploadERC20
                onClose={() => setAirdropFormOpen(false)}
                setAirdrop={(value) =>
                  setValue("addresses", value, { shouldDirty: true })
                }
              />
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  colorScheme="primary"
                  borderRadius="md"
                  onClick={() => setAirdropFormOpen(true)}
                  rightIcon={<Upload size={16} />}
                >
                  Upload addresses
                </Button>
                {addresses.length > 0 && (
                  <div className="gap-2 flex flex-row items-center justify-center text-green-500">
                    <CircleCheck className="text-green-500" size={16} />
                    <Text size="body.sm" color="inherit">
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
                transactionCount={1}
                isLoading={sendTransaction.isPending}
                type="submit"
                colorScheme="primary"
                alignSelf="flex-end"
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
