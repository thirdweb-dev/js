"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import Image from "next/image";
import { useState } from "react";
import {
  type Hex,
  getContract,
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
    contract: twCoinContract,
    address: account?.address ?? "0x",
    queryOptions: {
      enabled: !!account?.address,
    },
  });
  return (
    <div className="flex flex-col">
      {account ? (
        <>
          <div className="rounded-2xl border py-2 px-3 mb-3 backdrop-blur">
            <div className="text-2xl">Your balance</div>
            <div className="flex flex-row justify-start gap-3">
              <Image
                src="/twcoin.svg"
                className="mx-auto rounded-2xl animate-bounce size-5"
                width={50}
                height={50}
                alt=""
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
            className="bg-transparent border rounded-lg py-2 px-3 mb-3"
            type="text"
            placeholder="0x..."
            onChange={(e) => setTo(e.target.value)}
          />
        </>
      ) : (
        <div className="my-3 text-center">Send ERC20 tokens</div>
      )}

      {account ? (
        <TransactionButton
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

      {balance === 0n && (
        <div className="text-xs mt-2">
          Claim some test tokens from the example above
        </div>
      )}

      {error ? (
        <div className="text-red-600 mt-4 text-center">{error}</div>
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
