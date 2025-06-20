"use client";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, Loader2, OctagonXIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { Toaster, toast } from "sonner";
import { defineChain, type Hex, waitForReceipt, ZERO_ADDRESS } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { getTransactionStore } from "thirdweb/transaction";
import { shortenHex } from "thirdweb/utils";
import { getChain } from "../lib/chains";
import { client } from "../lib/client";
import { revalidate } from "../lib/revalidate";
import { Button } from "./ui/button";

const transactionQueue = new Set();
export function TransactionToastProvider() {
  const account = useActiveAccount();
  const store = useMemo(() => {
    return getTransactionStore(account?.address || ZERO_ADDRESS);
  }, [account?.address]);

  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getValue,
    store.getValue,
  );

  const handleTransactionToast = useCallback(
    async ({
      transactionHash,
      chainId,
    }: {
      transactionHash: Hex;
      chainId: number;
    }) => {
      const chainData = await getChain(chainId.toString());
      toast("Transaction pending", {
        action: chainData.explorers?.length ? (
          <Link
            href={`${chainData.explorers[0].url}/tx/${transactionHash}`}
            target="_blank"
          >
            <Button>View</Button>
          </Link>
        ) : undefined,
        description: shortenHex(transactionHash),
        duration: Number.POSITIVE_INFINITY,
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        id: toast(transactionHash),
      });

      waitForReceipt({
        chain: defineChain(chainId),
        client,
        transactionHash,
      })
        .then((receipt) => {
          toast.success("Transaction confirmed", {
            action: chainData.explorers?.length ? (
              <Link
                href={`${chainData.explorers[0].url}/tx/${receipt.transactionHash}`}
                target="_blank"
              >
                <Button>View</Button>
              </Link>
            ) : undefined,
            description: shortenHex(receipt.transactionHash),
            duration: 5000,
            icon: <CheckIcon className="h-4 w-4" />,
            id: toast(transactionHash),
          });
          setTimeout(() => {
            // Wait a minute for the indexer to catch up
            revalidate(`${chainId}-${account?.address}`);
          }, 5000);
        })
        .catch((e) => {
          toast.error("Transaction failed", {
            action: chainData.explorers?.length ? (
              <Link
                href={`${chainData.explorers[0].url}/tx/${transactionHash}`}
                target="_blank"
              >
                <Button>View</Button>
              </Link>
            ) : undefined,
            description: e.message,
            duration: 5000,
            icon: <OctagonXIcon className="h-4 w-4" />,
            id: toast(transactionHash),
          });
        });
    },
    [account?.address],
  );

  useQuery({
    enabled: !!account?.address,
    queryFn: async () => {
      if (!account?.address) return false;
      if (snapshot.length === 0) return false;

      const newTransactions = snapshot.filter(
        (t) => !transactionQueue.has(t.transactionHash),
      );

      for (const { transactionHash, chainId } of newTransactions) {
        transactionQueue.add(transactionHash);
        handleTransactionToast({ chainId, transactionHash });
      }
      return true;
    },
    queryKey: [snapshot],
    staleTime: Number.POSITIVE_INFINITY,
  });

  return <Toaster theme="dark" />;
}
