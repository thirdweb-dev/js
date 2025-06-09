import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  APPROVE_DESCRIPTION,
  SWAP_DESCRIPTION,
} from "app/nebula-app/_utils/constants";
import { roundToFirstDecimal } from "app/nebula-app/_utils/tokensUtils";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useV5DashboardChain } from "lib/v5-adapter";
import { ArrowRightLeftIcon, CheckIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import {
  NATIVE_TOKEN_ADDRESS,
  type PreparedTransaction,
  type ThirdwebClient,
  getAddress,
  prepareTransaction,
  toTokens,
} from "thirdweb";
import { TokenIcon, TokenProvider, TokenSymbol } from "thirdweb/react";
import { ChainIconClient } from "../../../../../components/icons/ChainIcon";
import type { NebulaSwapData } from "../../api/chat";
import { TxHashRow, type TxStatus, TxStatusRow, useTxSetup } from "./common";

export function SwapTransactionCard(props: {
  swapData: NebulaSwapData;
  client: ThirdwebClient;
  onTxSettled: (txHash: string) => void;
}) {
  const { status, setStatus, sendTx } = useTxSetup();

  return (
    <SwapTransactionCardLayout
      swapData={props.swapData}
      client={props.client}
      status={status}
      setStatus={setStatus}
      sendTx={(tx) => sendTx(tx, props.onTxSettled)}
    />
  );
}

export function SwapTransactionCardLayout(props: {
  swapData: NebulaSwapData;
  client: ThirdwebClient;
  status: TxStatus;
  setStatus: (status: TxStatus) => void;
  sendTx: (tx: PreparedTransaction) => Promise<void>;
}) {
  const { swapData } = props;
  const txChain = useV5DashboardChain(swapData.transaction.chainId);

  const isSellingNativeToken =
    getAddress(swapData.from.address) === getAddress(NATIVE_TOKEN_ADDRESS);

  return (
    <div className="max-w-lg">
      <div className="rounded-xl border bg-card">
        {/* header */}
        <div className="flex flex-row items-center justify-between border-b p-4 py-4 lg:px-5 lg:text-xl">
          <div className="flex flex-col">
            <h3 className="font-semibold text-foreground text-lg tracking-tight">
              Swap
            </h3>
          </div>
          <TransactionInfo content={SWAP_DESCRIPTION} />
        </div>

        {/* content */}
        <div className="px-4 text-sm lg:px-5 [&>*:not(:last-child)]:border-b [&>*]:min-h-14 [&>*]:py-3.5">
          <TokenRow
            amount={swapData.from.amount}
            symbol={swapData.from.symbol}
            chainId={swapData.from.chain_id}
            title="Sell"
            client={props.client}
            decimals={swapData.from.decimals}
            address={swapData.from.address}
          />

          <TokenRow
            amount={swapData.to.amount}
            symbol={swapData.to.symbol}
            chainId={swapData.to.chain_id}
            title="Buy"
            client={props.client}
            decimals={swapData.to.decimals}
            address={swapData.to.address}
            isReceiving={true}
          />

          {/* Status */}
          {props.status.type !== "idle" && (
            <TxStatusRow status={props.status} />
          )}

          {/* Transaction Hash */}
          {"txHash" in props.status && props.status.txHash && (
            <TxHashRow
              chainId={swapData.transaction.chainId}
              txHash={props.status.txHash}
            />
          )}
        </div>

        {/* footer */}
        {props.status.type !== "confirmed" && (
          <div className="flex items-center justify-end border-t px-4 py-4 lg:px-5">
            <TransactionButton
              client={props.client}
              isPending={props.status.type === "sending"}
              transactionCount={undefined}
              txChainID={swapData.transaction.chainId}
              variant="default"
              disabled={
                props.status.type === "sending" ||
                props.status.type === "confirming"
              }
              size="sm"
              onClick={async () => {
                const tx = prepareTransaction({
                  chain: txChain,
                  client: props.client,
                  data: swapData.transaction.data,
                  to: swapData.transaction.to,
                  erc20Value: isSellingNativeToken
                    ? undefined
                    : {
                        amountWei: BigInt(swapData.from.amount),
                        tokenAddress: swapData.from.address,
                      },
                });

                props.sendTx(tx);
              }}
              className="gap-2"
              isLoggedIn={true}
            >
              <ArrowRightLeftIcon className="size-4" />
              Swap Tokens
            </TransactionButton>
          </div>
        )}
      </div>
    </div>
  );
}

export function ApproveTransactionCard(props: {
  swapData: NebulaSwapData;
  client: ThirdwebClient;
}) {
  const { status, setStatus, sendTx } = useTxSetup();

  return (
    <ApproveTransactionCardLayout
      swapData={props.swapData}
      client={props.client}
      status={status}
      setStatus={setStatus}
      sendTx={(tx) => sendTx(tx, undefined)}
    />
  );
}

export function ApproveTransactionCardLayout(props: {
  swapData: NebulaSwapData;
  client: ThirdwebClient;
  status: TxStatus;
  setStatus: (status: TxStatus) => void;
  sendTx: (tx: PreparedTransaction) => Promise<void>;
}) {
  const { swapData } = props;
  const txChain = useV5DashboardChain(swapData.transaction.chainId);

  const isTransactionPending =
    props.status.type === "sending" || props.status.type === "confirming";

  return (
    <div className="max-w-lg">
      <div className="rounded-xl border bg-card">
        {/* header */}
        <div className="flex flex-row items-center justify-between border-b p-4 py-4 lg:px-5 lg:text-xl">
          <div className="flex flex-col">
            <h3 className="font-semibold text-foreground text-lg tracking-tight">
              Approve
            </h3>
            <p className="text-muted-foreground text-sm">
              Approve spending to swap tokens on your behalf
            </p>
          </div>
          <TransactionInfo content={APPROVE_DESCRIPTION} />
        </div>

        {/* content */}
        <div className="px-4 text-sm lg:px-5 [&>*:not(:last-child)]:border-b [&>*]:min-h-14 [&>*]:py-3.5">
          <TokenRow
            amount={swapData.from.amount}
            symbol={swapData.from.symbol}
            chainId={swapData.from.chain_id}
            title="Approve Spending"
            client={props.client}
            decimals={swapData.from.decimals}
            address={swapData.from.address}
          />

          <TokenRow
            amount={swapData.to.amount}
            symbol={swapData.to.symbol}
            chainId={swapData.to.chain_id}
            title="To Buy"
            client={props.client}
            decimals={swapData.to.decimals}
            address={swapData.to.address}
            isReceiving={true}
          />

          {/* Status */}
          {props.status.type !== "idle" && (
            <TxStatusRow status={props.status} />
          )}

          {/* Transaction Hash */}
          {"txHash" in props.status && props.status.txHash && (
            <TxHashRow
              chainId={swapData.transaction.chainId}
              txHash={props.status.txHash}
            />
          )}
        </div>

        {/* footer */}
        {props.status.type !== "confirmed" && (
          <div className="flex items-center justify-end border-t px-4 py-4 lg:px-5">
            <TransactionButton
              client={props.client}
              isPending={isTransactionPending}
              transactionCount={undefined}
              txChainID={swapData.transaction.chainId}
              variant="default"
              disabled={isTransactionPending}
              size="sm"
              onClick={async () => {
                const tx = prepareTransaction({
                  chain: txChain,
                  client: props.client,
                  data: swapData.transaction.data,
                  to: swapData.transaction.to,
                });

                props.sendTx(tx);
              }}
              className="gap-2"
              isLoggedIn={true}
            >
              <CheckIcon className="size-4" />
              Approve
            </TransactionButton>
          </div>
        )}
      </div>
    </div>
  );
}

function TokenRow(props: {
  amount: string;
  symbol: string;
  address: string;
  chainId: number;
  client: ThirdwebClient;
  title: string;
  decimals: number;
  isReceiving?: boolean;
}) {
  const chain = useV5DashboardChain(props.chainId);
  const tokenValue = toTokens(BigInt(props.amount), props.decimals);
  const tokenDisplayValue = roundToFirstDecimal(
    Number(toTokens(BigInt(props.amount), props.decimals)),
  );
  const isNativeAddress = props.address.toLowerCase() === NATIVE_TOKEN_ADDRESS;

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-col">
        <div className="font-medium text-muted-foreground">{props.title}</div>
        <div className="flex flex-row items-center gap-1">
          {props.isReceiving ? (
            <ToolTipLabel
              label={`${tokenValue} ${props.symbol}`}
              contentClassName="!text-xs"
            >
              <p className="cursor-help text-lg">~{tokenDisplayValue}</p>
            </ToolTipLabel>
          ) : (
            <p className="text-lg">{tokenDisplayValue}</p>
          )}
          <TokenProvider
            client={props.client}
            address={props.address}
            chain={chain}
          >
            <ToolTipLabel
              label={`${props.address.slice(0, 6)}...${props.address.slice(-4)}`}
              contentClassName="!text-xs"
            >
              {isNativeAddress ? (
                <TokenSymbol className="cursor-help text-lg" />
              ) : (
                <Link
                  href={`https://thirdweb.com/${chain.id}/${props.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TokenSymbol className="text-lg hover:underline" />
                </Link>
              )}
            </ToolTipLabel>
            <TokenIcon className="size-4" />
          </TokenProvider>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <ChainIconClient
            src={chain.icon?.url || ""}
            client={props.client}
            className="size-4"
          />
          <div>{chain.name}</div>
        </div>
      </div>
    </div>
  );
}

function TransactionInfo(props: {
  content: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="!h-auto w-auto shrink-0 gap-2 p-2">
          <InfoIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top">
        <div className="grid gap-4">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">{props.content}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
