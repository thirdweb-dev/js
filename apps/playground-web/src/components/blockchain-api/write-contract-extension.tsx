"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
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
        src="/twcoin.svg"
        className="mx-auto rounded-2xl animate-bounce size-32"
        width={50}
        height={50}
        alt=""
      />
      <div className="my-3 text-center">Claim free testnet tokens</div>
      {account ? (
        <TransactionButton
          transaction={() =>
            claimTo({
              contract: twCoinContract,
              to: account.address,
              quantity: "10",
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
            setError(error.message);
          }}
          onClick={() => {
            setError("");
            setTxHash("");
          }}
        >
          Claim {txHash ? "more" : ""}
        </TransactionButton>
      ) : (
        <ConnectButton client={THIRDWEB_CLIENT} />
      )}

      {error ? (
        <div className="text-red-600 text-sm mt-4 text-center">{error}</div>
      ) : (
        <>
          {txHash && sepolia.blockExplorers && (
            <a
              target="_blank"
              rel="noreferrer"
              href={`${sepolia.blockExplorers[0].url}/tx/${txHash}`}
              className="text-center text-green-400 mt-3"
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
