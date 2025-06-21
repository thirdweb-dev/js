"use client";

import Image from "next/image";
import { useState } from "react";
import {
  getContract,
  type Hex,
  prepareContractCall,
  toTokens,
  toUnits,
} from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { balanceOf } from "thirdweb/extensions/erc20";
import {
  ConnectButton,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { THIRDWEB_CLIENT } from "@/lib/client";
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
  const [to, setTo] = useState<string>("");
  const { data: balance } = useReadContract(balanceOf, {
    address: account?.address ?? "0x",
    contract: twCoinContract,
    queryOptions: {
      enabled: !!account?.address,
    },
  });
  return (
    <div className="flex flex-col">
      {account ? (
        <>
          <div className="mb-3 rounded-2xl border px-3 py-2 backdrop-blur">
            <div className="text-2xl">Your balance</div>
            <div className="flex flex-row justify-start gap-3">
              <Image
                alt=""
                className="mx-auto size-5 animate-bounce rounded-2xl"
                height={50}
                src="/twcoin.svg"
                width={50}
              />
              <div>
                <span className="text-green-600">
                  {balance ? toTokens(balance, 18) : "0.0"}
                </span>{" "}
                TWCOIN
              </div>
            </div>
          </div>

          <input
            className="mb-3 rounded-lg border bg-transparent px-3 py-2"
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            type="text"
          />
        </>
      ) : (
        <div className="my-3 text-center">Send ERC20 tokens</div>
      )}

      {account ? (
        <TransactionButton
          onClick={() => {
            setError("");
            setTxHash("");
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
          onTransactionConfirmed={(receipt) => {
            console.log("Transaction confirmed", receipt.transactionHash);
          }}
          onTransactionSent={(result) => {
            console.log("Transaction submitted", result.transactionHash);
            setTxHash(result.transactionHash);
          }}
          transaction={() =>
            prepareContractCall({
              contract: twCoinContract,
              method:
                "function transfer(address to, uint256 value) returns (bool)",
              // In reality you should properly validate the params
              // we keep it simple in this demo
              params: [to as Hex, toUnits("5", 18)],
            })
          }
        >
          Send {txHash ? "more" : ""}
        </TransactionButton>
      ) : (
        <ConnectButton client={THIRDWEB_CLIENT} />
      )}

      {balance === 0n && (
        <div className="mt-2 text-xs">
          Claim some test tokens from the example above
        </div>
      )}

      {error ? (
        <div className="mt-4 text-center text-red-600">{error}</div>
      ) : (
        <>
          {txHash && sepolia.blockExplorers && (
            <a
              className="mt-3 text-center text-green-400"
              href={`${sepolia.blockExplorers[0].url}/tx/${txHash}`}
              rel="noreferrer"
              target="_blank"
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
