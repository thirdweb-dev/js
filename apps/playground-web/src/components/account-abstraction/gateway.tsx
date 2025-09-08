"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { encode, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { claimTo, getNFT, getOwnedNFTs } from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  MediaRenderer,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
  useReadContract,
} from "thirdweb/react";
import { stringify } from "thirdweb/utils";
import { inAppWallet } from "thirdweb/wallets/in-app";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const url = `http://${process.env.NEXT_PUBLIC_API_URL}`;

const chain = baseSepolia;
const editionDropAddress = "0x638263e3eAa3917a53630e61B1fBa685308024fa";
const editionDropTokenId = 2n;

const editionDropContract = getContract({
  address: editionDropAddress,
  chain,
  client: THIRDWEB_CLIENT,
});

const iaw = inAppWallet();

function TransactionRow({ transactionId }: { transactionId: string }) {
  const { data: txStatus, isLoading } = useQuery({
    enabled: !!transactionId,
    queryFn: async () => {
      const response = await fetch(`${url}/v1/transactions/${transactionId}`, {
        headers: {
          "Content-type": "application/json",
          "x-client-id": THIRDWEB_CLIENT.clientId,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Failed to send transaction: ${response.statusText} - ${text}`,
        );
      }

      const results = await response.json();
      const transaction = results.result;

      return transaction;
    },
    queryKey: ["txStatus", transactionId],
    refetchInterval: 2000,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case undefined:
      case "QUEUED":
        return <Badge variant="warning">Queued</Badge>;
      case "SUBMITTED":
        return <Badge variant="default">Submitted</Badge>;
      case "CONFIRMED":
        return <Badge variant="success">Confirmed</Badge>;
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{"Unknown"}</Badge>;
    }
  };

  const renderTransactionHash = () => {
    if (!txStatus) return "-";

    const execStatus = txStatus?.status;

    let txHash: string | undefined;
    if (execStatus === "CONFIRMED") {
      txHash = txStatus.transactionHash;
    }

    if (txHash && chain.blockExplorers?.[0]?.url) {
      return (
        <a
          className="text-blue-500 hover:text-blue-700 underline font-mono text-sm"
          href={`${chain.blockExplorers[0].url}/tx/${txHash}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {txHash.slice(0, 6)}...{txHash.slice(-4)}
        </a>
      );
    }

    return txHash ? (
      <span className="font-mono text-sm">
        {txHash.slice(0, 6)}...{txHash.slice(-4)}
      </span>
    ) : (
      "-"
    );
  };

  return (
    <TableRow>
      <TableCell className="font-mono text-sm">
        {transactionId.slice(0, 8)}...{transactionId.slice(-4)}
      </TableCell>
      <TableCell>
        {isLoading || !txStatus.executionResult?.status ? (
          <Badge variant="warning">Queued</Badge>
        ) : (
          getStatusBadge(txStatus.executionResult?.status)
        )}
      </TableCell>
      <TableCell>{renderTransactionHash()}</TableCell>
    </TableRow>
  );
}

export function GatewayPreview() {
  const [txIds, setTxIds] = useState<string[]>([]);
  const activeEOA = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const { data: nft, isLoading: isNftLoading } = useReadContract(getNFT, {
    contract: editionDropContract,
    tokenId: editionDropTokenId,
  });
  const { data: ownedNfts } = useReadContract(getOwnedNFTs, {
    // biome-ignore lint/style/noNonNullAssertion: handled by queryOptions
    address: activeEOA?.address!,
    contract: editionDropContract,
    queryOptions: { enabled: !!activeEOA, refetchInterval: 2000 },
    useIndexer: false,
  });

  const { data: preparedTx } = useQuery({
    enabled: !!activeEOA,
    queryFn: async () => {
      if (!activeEOA) {
        throw new Error("No active EOA");
      }
      const tx = claimTo({
        contract: editionDropContract,
        quantity: 1n,
        to: activeEOA.address,
        tokenId: editionDropTokenId,
      });
      return {
        data: await encode(tx),
        to: editionDropContract.address,
      };
    },
    queryKey: ["tx", activeEOA?.address],
  });

  const sendTransactionMutation = useMutation({
    mutationFn: async () => {
      if (!preparedTx || !activeEOA) {
        throw new Error("Missing required data");
      }

      const response = await fetch(`${url}/v1/transactions`, {
        body: stringify({
          from: activeEOA.address,
          chainId: baseSepolia.id,
          transactions: [preparedTx],
        }),
        headers: {
          Authorization: `Bearer ${activeWallet?.getAuthToken?.()}`,
          "Content-type": "application/json",
          "x-client-id": THIRDWEB_CLIENT.clientId,
        },
        method: "POST",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Failed to send transaction: ${response.statusText} - ${text}`,
        );
      }

      const results = await response.json();
      const txId = results.result?.transactionIds?.[0];
      if (!txId) {
        throw new Error("No transaction ID");
      }

      return txId;
    },
    onSuccess: (txId) => {
      setTxIds((prev) => [...prev, txId]);
    },
  });

  if (activeEOA && activeWallet && activeWallet?.id !== iaw.id) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        Please connect with an in-app wallet for this example
        <Button
          onClick={() => {
            disconnect(activeWallet);
          }}
        >
          Disconnect current wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isNftLoading ? (
        <div className="mt-24 w-full">Loading...</div>
      ) : (
        <>
          <div className="flex flex-col justify-center gap-2 p-2">
            <ConnectButton
              chain={chain}
              client={THIRDWEB_CLIENT}
              connectButton={{
                label: "Login to mint!",
              }}
              wallets={[iaw]}
            />
          </div>
          {nft ? (
            <MediaRenderer
              client={THIRDWEB_CLIENT}
              src={nft.metadata.image}
              style={{ marginTop: "10px", width: "300px" }}
            />
          ) : null}
          {activeEOA ? (
            <div className="flex flex-col justify-center gap-4 p-2">
              <p className="mb-2 text-center font-semibold">
                You own {ownedNfts?.[0]?.quantityOwned.toString() || "0"}{" "}
                {nft?.metadata?.name}
              </p>
              <Button
                disabled={
                  sendTransactionMutation.isPending || !preparedTx || !activeEOA
                }
                onClick={() => sendTransactionMutation.mutate()}
              >
                {sendTransactionMutation.isPending ? "Minting..." : "Mint NFT"}
              </Button>
            </div>
          ) : null}
          {txIds.length > 0 && (
            <div className="w-full max-w-2xl">
              <TableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tx ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>TX Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {txIds.map((txId) => (
                      <TransactionRow key={txId} transactionId={txId} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
