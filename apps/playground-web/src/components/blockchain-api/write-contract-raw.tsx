"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useState } from "react";
import { getContract, prepareContractCall, toUnits } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import {
  ConnectButton,
  TransactionButton,
  useActiveAccount,
} from "thirdweb/react";
import { shortenAddress } from "./shortenAddress";

const twCoinContract = getContract({
  address: "0xACf072b740a23D48ECd302C9052fbeb3813b60a6",
  chain: sepolia,
  client: THIRDWEB_CLIENT,
});

export function WriteContractRawPreview() {
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const account = useActiveAccount();
  return (
    <div className="flex flex-col">
      <img
        src="/twcoin.jpeg"
        width={"120px"}
        height={"120px"}
        className="mx-auto rounded-2xl"
      />
      <div className="my-3 text-center">Send ERC20 tokens</div>
      {account ? (
        <TransactionButton
          transaction={() =>
            prepareContractCall({
              contract: twCoinContract,
              method:
                "function transfer(address to, uint256 value) returns (bool)",
              params: [
                "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
                toUnits("5", 18),
              ],
            })
          }
          onTransactionSent={(result) => {
            console.log("Transaction submitted", result.transactionHash);
            setTxHash(result.transactionHash);
          }}
          onTransactionConfirmed={(receipt) => {
            console.log("Transaction confirmed", receipt.transactionHash);
          }}
          onError={(error) => {
            // Probably the most common error for this use case
            // we don't want a long error message to mess up the UI
            const _message = error.message.includes(
              "ERC20: transfer amount exceeds balance",
            )
              ? "Don't have enough token"
              : error.message;
            setError(_message);
          }}
          onClick={() => {
            setError("");
            setTxHash("");
          }}
        >
          Send {txHash ? "more" : ""}
        </TransactionButton>
      ) : (
        <ConnectButton client={THIRDWEB_CLIENT} />
      )}

      {error ? (
        <div className="text-red-500 text-sm mt-4 text-center">{error}</div>
      ) : (
        <>
          {txHash && (
            <a
              target="_blank"
              href={`${sepolia.blockExplorers![0].url}/tx/${txHash}`}
              className="text-center text-green-600 mt-3"
            >
              Tx sent:{" "}
              <span className="underline">{shortenAddress(txHash, 6)}</span>
            </a>
          )}
        </>
      )}
    </div>
  );
}
