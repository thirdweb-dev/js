"use client";
import { useQuery } from "@tanstack/react-query";
import { CodeClient } from "@workspace/ui/components/code/code.client";
import { Img } from "@workspace/ui/components/img";
import { Spinner } from "@workspace/ui/components/spinner";
import { ArrowRightIcon, CircleCheckIcon, CircleXIcon } from "lucide-react";
import Link from "next/link";
import { NATIVE_TOKEN_ADDRESS, type ThirdwebClient } from "thirdweb";
import type { Status, Token } from "thirdweb/bridge";
import { status } from "thirdweb/bridge";
import { toTokens } from "thirdweb/utils";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { fetchChain } from "@/utils/fetchChain";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";

type PurchaseData = Exclude<Status, { status: "NOT_FOUND" }>["purchaseData"];

export function BridgeStatus(props: {
  bridgeStatus: Status;
  client: ThirdwebClient;
}) {
  const { bridgeStatus } = props;
  const purchaseDataString =
    bridgeStatus.status !== "NOT_FOUND" && bridgeStatus.purchaseData
      ? getPurchaseData(bridgeStatus.purchaseData)
      : undefined;

  return (
    <div className="bg-card rounded-xl border relative">
      {bridgeStatus.status === "FAILED" &&
        bridgeStatus.transactions.length > 0 && (
          <FailedBridgeStatusContent
            transactions={bridgeStatus.transactions}
            client={props.client}
          />
        )}

      {(bridgeStatus.status === "COMPLETED" ||
        bridgeStatus.status === "PENDING") && (
        <BridgeStatusContent
          bridgeStatus={bridgeStatus}
          client={props.client}
        />
      )}

      <div className="px-6 lg:px-8 py-7 space-y-1.5">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground "> Status </p>

          <div
            className={cn(
              "flex items-center gap-1.5 text-sm capitalize",
              bridgeStatus.status === "COMPLETED" && "text-green-500",
              bridgeStatus.status === "PENDING" && "text-blue-500",
              bridgeStatus.status === "FAILED" && "text-red-500",
            )}
          >
            {bridgeStatus.status === "COMPLETED" && (
              <CircleCheckIcon className="size-3.5" />
            )}
            {bridgeStatus.status === "PENDING" && (
              <Spinner className="size-3.5" />
            )}
            {bridgeStatus.status === "FAILED" && (
              <CircleXIcon className="size-3.5" />
            )}
            {bridgeStatus.status === "NOT_FOUND" && (
              <CircleXIcon className="size-3.5" />
            )}

            {bridgeStatus.status.toLowerCase().replace("_", " ")}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground ">Payment ID</p>
          <CopyTextButton
            textToCopy={bridgeStatus.paymentId}
            textToShow={`${bridgeStatus.paymentId.slice(0, 6)}...${bridgeStatus.paymentId.slice(-4)}`}
            tooltip="Payment ID"
            className="text-sm translate-x-1.5"
            copyIconPosition="left"
            variant="ghost"
          />
        </div>
      </div>

      {purchaseDataString && (
        <div className="px-6 lg:px-8 py-7 space-y-2 border-t border-dashed">
          <p className="text-sm text-muted-foreground ">Purchase Data</p>
          <CodeClient
            code={purchaseDataString}
            lang="json"
            className="[&_code]:text-xs"
            scrollableClassName="p-3"
          />
        </div>
      )}
    </div>
  );
}

function TokenInfo(props: {
  label: string;
  addressLabel: string;
  token: Token;
  amountWei: bigint | undefined;
  walletAddress: string;
  client: ThirdwebClient;
  txHash: string | undefined;
}) {
  const chainQuery = useChainQuery(props.token.chainId);

  return (
    <div className="flex-1 pt-10 pb-9 px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {props.label}
        </h3>
      </div>

      <div className="pb-7 pt-6 border-b border-dashed">
        <div className="flex items-center gap-3">
          <div className="relative hover:ring-2 hover:ring-offset-2 hover:ring-offset-card hover:ring-foreground/30 rounded-full">
            <Link
              href={
                props.token.address.toLowerCase() ===
                NATIVE_TOKEN_ADDRESS.toLowerCase()
                  ? `/${chainQuery.data?.slug || props.token.chainId}`
                  : `/${chainQuery.data?.slug || props.token.chainId}/${props.token.address}`
              }
              target="_blank"
              aria-label="View Token"
              className="absolute inset-0 z-10"
            />

            <Img
              src={props.token.iconUri}
              alt={props.token.name}
              className="size-10 rounded-full"
              fallback={
                <div className="size-10 from-blue-500 to-foreground rounded-full bg-gradient-to-b" />
              }
            />

            <div className="absolute -bottom-0.5 -right-0.5 bg-background p-0.5 rounded-full">
              <Img
                src={resolveSchemeWithErrorHandler({
                  client: props.client,
                  uri: chainQuery.data?.icon?.url,
                })}
                alt={props.token.name}
                className="size-4 rounded-full"
                fallback={
                  <div className="size-4 from-blue-500 to-foreground rounded-full bg-gradient-to-b" />
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-lg text-foreground font-medium tracking-tight leading-none">
              {props.amountWei ? (
                <>
                  {toTokens(props.amountWei, props.token.decimals)}{" "}
                  {props.token.symbol}
                </>
              ) : (
                "N/A"
              )}
            </p>
            <SkeletonContainer
              skeletonData={`Chain ${props.token.chainId}`}
              loadedData={chainQuery.data?.name}
              className="[&_*]:flex"
              render={(data) => (
                <Link
                  href={`/${chainQuery.data?.slug || props.token.chainId}`}
                  className="text-sm text-muted-foreground leading-none hover:underline"
                  target="_blank"
                >
                  {data}
                </Link>
              )}
            />
          </div>
        </div>
      </div>

      <div className="h-6" />

      <div className="space-y-1.5">
        <div className="flex gap-2.5 justify-between">
          <p className="text-sm text-muted-foreground ">{props.addressLabel}</p>
          <WalletAddress
            address={props.walletAddress}
            client={props.client}
            className="py-0.5 h-auto text-sm [&>*]:!font-sans"
            iconClassName="size-3.5"
          />
        </div>

        <div className="flex gap-2 justify-between">
          <p className="text-sm text-muted-foreground ">Token Address</p>
          <CopyTextButton
            textToCopy={props.token.address}
            textToShow={`${props.token.address.slice(0, 6)}...${props.token.address.slice(-4)}`}
            tooltip="Token Address"
            className="text-sm translate-x-1.5"
            copyIconPosition="left"
            variant="ghost"
          />
        </div>

        <div className="flex gap-2 justify-between">
          <p className="text-sm text-muted-foreground ">Transaction Hash</p>
          {props.txHash ? (
            <CopyTextButton
              textToCopy={props.txHash}
              textToShow={`${props.txHash.slice(0, 6)}...${props.txHash.slice(-4)}`}
              tooltip="Transaction Hash"
              className="text-sm translate-x-1.5"
              copyIconPosition="left"
              variant="ghost"
            />
          ) : (
            <p className="text-sm text-muted-foreground ">N/A</p>
          )}
        </div>
      </div>
    </div>
  );
}

function BridgeStatusContent(props: {
  bridgeStatus: Exclude<Status, { status: "FAILED" } | { status: "NOT_FOUND" }>;
  client: ThirdwebClient;
}) {
  const { bridgeStatus } = props;

  const fromTxHash = bridgeStatus.transactions.find(
    (tx) => tx.chainId === bridgeStatus.originChainId,
  )?.transactionHash;
  const toTxHash = bridgeStatus.transactions.find(
    (tx) => tx.chainId === bridgeStatus.destinationChainId,
  )?.transactionHash;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-dashed">
      <TokenInfo
        label="From"
        token={bridgeStatus.originToken}
        amountWei={bridgeStatus.originAmount}
        walletAddress={bridgeStatus.sender}
        client={props.client}
        txHash={fromTxHash}
        addressLabel="Sender"
      />

      <div className="border-t lg:border-l lg:border-t-0 border-dashed relative">
        <div className="p-1.5 rounded-full bg-background absolute top-0 lg:top-1/2 left-1/2 lg:left-0 -translate-y-1/2 -translate-x-1/2 border">
          <ArrowRightIcon className="size-4 text-muted-foreground rotate-90 lg:rotate-0" />
        </div>
        <TokenInfo
          label="To"
          token={bridgeStatus.destinationToken}
          // TODO - destinationAmount is not available in PENDING status, fix it in API
          amountWei={
            bridgeStatus.status === "COMPLETED"
              ? bridgeStatus.destinationAmount
              : undefined
          }
          walletAddress={bridgeStatus.receiver}
          client={props.client}
          txHash={toTxHash}
          addressLabel="Receiver"
        />
      </div>
    </div>
  );
}

function FailedBridgeStatusContent(props: {
  transactions: { chainId: number; transactionHash: string }[];
  client: ThirdwebClient;
}) {
  return (
    <div className="px-6 lg:px-8 py-7 space-y-1.5 border-b border-dashed">
      <h3 className="text-base font-medium tracking-tight mb-3">
        Transactions
      </h3>
      <div className="flex flex-col gap-2">
        {props.transactions.map((tx) => {
          return (
            <TxHashRow
              key={tx.chainId}
              client={props.client}
              chainId={tx.chainId}
              txHash={tx.transactionHash}
            />
          );
        })}
      </div>
    </div>
  );
}

function useChainQuery(chainId: number | undefined) {
  return useQuery({
    enabled: !!chainId,
    queryKey: ["chain-metadata", chainId],
    queryFn: async () => {
      if (!chainId) {
        return null;
      }
      return fetchChain(chainId);
    },
  });
}

function TxHashRow(props: {
  client: ThirdwebClient;
  chainId: number;
  txHash: string;
}) {
  const chainQuery = useChainQuery(props.chainId);

  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        <Img
          src={resolveSchemeWithErrorHandler({
            client: props.client,
            uri: chainQuery.data?.icon?.url,
          })}
          alt={chainQuery.data?.name}
          className="size-4 rounded-full"
          fallback={
            <div className="size-4 from-blue-500 to-foreground rounded-full bg-gradient-to-b" />
          }
        />
        <SkeletonContainer
          skeletonData={`Chain ${props.chainId}`}
          loadedData={chainQuery.data?.name}
          render={(data) => (
            <p className="text-sm text-muted-foreground">{data}</p>
          )}
        />
      </div>
      <CopyTextButton
        textToCopy={props.txHash}
        textToShow={`${props.txHash.slice(0, 6)}...${props.txHash.slice(-4)}`}
        tooltip="Copy Transaction Hash"
        className="text-sm"
        copyIconPosition="right"
        variant="ghost"
      />
    </div>
  );
}

export function BridgeStatusWithPolling(props: {
  bridgeStatus: Status;
  client: ThirdwebClient;
  chainId: number;
  transactionHash: string;
}) {
  const bridgeStatusQuery = useQuery({
    enabled:
      props.bridgeStatus.status === "PENDING" ||
      props.bridgeStatus.status === "NOT_FOUND",
    queryKey: ["bridge-status", props.transactionHash, props.chainId],
    queryFn: () =>
      status({
        chainId: props.chainId,
        transactionHash: props.transactionHash as `0x${string}`,
        client: props.client,
      }),
    refetchInterval(query) {
      const status = query.state.data?.status;
      if (status === "COMPLETED" || status === "FAILED") {
        return false;
      }
      return 5000;
    },
  });

  return (
    <BridgeStatus
      bridgeStatus={bridgeStatusQuery.data || props.bridgeStatus}
      client={props.client}
    />
  );
}

function getPurchaseData(purchaseData: PurchaseData) {
  try {
    return JSON.stringify(purchaseData, null, 2);
  } catch {
    return undefined;
  }
}
