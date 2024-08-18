"use client";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, Loader2, OctagonXIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { Toaster, toast } from "sonner";
import { type Hex, ZERO_ADDRESS, defineChain, waitForReceipt } from "thirdweb";
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
    }: { transactionHash: Hex; chainId: number }) => {
      const chainData = await getChain(chainId.toString());
      toast("Transaction pending", {
        id: toast(transactionHash),
        description: shortenHex(transactionHash),
        duration: Number.POSITIVE_INFINITY,
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        action: chainData.explorers?.length ? (
          <Link
            target="_blank"
            href={`${chainData.explorers[0].url}/tx/${transactionHash}`}
          >
            <Button>View</Button>
          </Link>
        ) : undefined,
      });

      waitForReceipt({
        client,
        chain: defineChain(chainId),
        transactionHash,
      })
        .then((receipt) => {
          toast.success("Transaction confirmed", {
            id: toast(transactionHash),
            description: shortenHex(receipt.transactionHash),
            duration: 5000,
            icon: <CheckIcon className="w-4 h-4" />,
            action: chainData.explorers?.length ? (
              <Link
                target="_blank"
                href={`${chainData.explorers[0].url}/tx/${receipt.transactionHash}`}
              >
                <Button>View</Button>
              </Link>
            ) : undefined,
          });
          setTimeout(() => {
            // Wait a minute for the indexer to catch up
            revalidate(`${chainId}-${account?.address}`);
          }, 5000);
        })
        .catch((e) => {
          toast.error("Transaction failed", {
            id: toast(transactionHash),
            description: e.message,
            icon: <OctagonXIcon className="w-4 h-4" />,
            duration: 5000,
            action: chainData.explorers?.length ? (
              <Link
                target="_blank"
                href={`${chainData.explorers[0].url}/tx/${transactionHash}`}
              >
                <Button>View</Button>
              </Link>
            ) : undefined,
          });
        });
    },
    [account?.address],
  );

  useQuery({
    queryKey: [snapshot],
    queryFn: async () => {
      if (!account?.address) return false;
      if (snapshot.length === 0) return false;

      const newTransactions = snapshot.filter(
        (t) => !transactionQueue.has(t.transactionHash),
      );

      for (const { transactionHash, chainId } of newTransactions) {
        transactionQueue.add(transactionHash);
        handleTransactionToast({ transactionHash, chainId });
      }
      return true;
    },
    enabled: !!account?.address,
    staleTime: Number.POSITIVE_INFINITY,
  });

  return <Toaster theme="dark" />;
}
