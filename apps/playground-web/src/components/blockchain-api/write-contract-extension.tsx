"use client";

import Image from "next/image";
import { useState } from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { claimTo } from "thirdweb/extensions/erc20";
import {
  ConnectButton,
  TransactionButton,
  useActiveAccount,
} from "thirdweb/react";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { shortenAddress } from "./shortenAddress";

const twCoinContract = getContract({
  address: "0xACf072b740a23D48ECd302C9052fbeb3813b60a6",
  chain: sepolia,
  client: THIRDWEB_CLIENT,
});

export function WriteContractExtensionPreview() {
  const [txHash, setTxHash] = useState<string>("");
  const account = useActiveAccount();
  const [error, setError] = useState<string>("");
  return (
    <div className="flex flex-col">
      <Image
        alt=""
        className="mx-auto size-32 animate-bounce rounded-2xl"
        height={50}
        src="/twcoin.svg"
        width={50}
      />
      <div className="my-3 text-center">Claim free testnet tokens</div>
      {account ? (
        <TransactionButton
          onClick={() => {
            setError("");
            setTxHash("");
          }}
          onError={(error) => {
            setError(error.message);
          }}
          onTransactionConfirmed={(receipt) => {
            console.log("Transaction confirmed", receipt.transactionHash);
          }}
          onTransactionSent={(result) => {
            console.log("Transaction submitted", result.transactionHash);
            setTxHash(result.transactionHash);
          }}
          transaction={() =>
            claimTo({
              contract: twCoinContract,
              quantity: "10",
              to: account.address,
            })
          }
        >
          Claim {txHash ? "more" : ""}
        </TransactionButton>
      ) : (
        <ConnectButton client={THIRDWEB_CLIENT} />
      )}

      {error ? (
        <div className="mt-4 text-center text-red-600 text-sm">{error}</div>
      ) : txHash && sepolia.blockExplorers ? (
        <a
          className="mt-3 text-center text-green-400"
          href={`${sepolia.blockExplorers[0].url}/tx/${txHash}`}
          rel="noreferrer"
          target="_blank"
        >
          Tx sent:{" "}
          <span className="underline">{shortenAddress(txHash, 6)}</span>
        </a>
      ) : null}
    </div>
  );
}
