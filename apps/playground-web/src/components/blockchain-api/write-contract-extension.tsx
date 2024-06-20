"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
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
  return (
    <div className="flex flex-col">
      <img
        src="/twcoin.jpeg"
        width={"120px"}
        height={"120px"}
        className="mx-auto rounded-2xl"
      />
      <div className="my-3">Claim free testnet coins</div>
      {account ? (
        <TransactionButton
          transaction={() => {
            const tx = claimTo({
              contract: twCoinContract,
              to: account.address,
              quantity: "10",
            });
            return tx;
          }}
          onTransactionSent={(result) => {
            console.log("Transaction submitted", result.transactionHash);
            setTxHash(result.transactionHash);
          }}
          onTransactionConfirmed={(receipt) => {
            console.log("Transaction confirmed", receipt.transactionHash);
          }}
          onError={(error) => {
            console.error("Transaction error", error);
          }}
        >
          Claim {txHash ? "more" : ""}
        </TransactionButton>
      ) : (
        <ConnectButton client={THIRDWEB_CLIENT} />
      )}

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
    </div>
  );
}
