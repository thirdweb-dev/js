import { ArrowRightLeftIcon, CheckIcon } from "lucide-react";
import {
  defineChain,
  getAddress,
  NATIVE_TOKEN_ADDRESS,
  type PreparedTransaction,
  prepareTransaction,
  type ThirdwebClient,
  toTokens,
} from "thirdweb";
import { TransactionButton } from "@/components/blocks/buttons/TransactionButton";
import { ChainIconClient } from "@/components/blocks/ChainIcon";
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
      client={props.client}
      sendTx={(tx) => sendTx(tx, props.onTxSettled)}
      setStatus={setStatus}
      status={status}
      swapData={props.swapData}
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
  const txChain = defineChain(swapData.transaction.chainId);

  const isSellingNativeToken =
    getAddress(swapData.from.address) === getAddress(NATIVE_TOKEN_ADDRESS);

  return (
    <div className="max-w-lg">
      <div className="rounded-xl border bg-card">
        {/* header */}
        <div className="border-b p-4 py-4 lg:px-5 lg:text-xl">
          <h3 className="font-semibold text-foreground text-lg tracking-tight ">
            Swap
          </h3>
        </div>

        {/* content */}
        <div className="px-4 text-sm lg:px-5 [&>*:not(:last-child)]:border-b [&>*]:min-h-14 [&>*]:py-3.5">
          <TokenRow
            amount={swapData.from.amount}
            chainId={swapData.from.chain_id}
            client={props.client}
            decimals={swapData.from.decimals}
            symbol={swapData.from.symbol}
            title="Sell"
          />

          <TokenRow
            amount={swapData.to.amount}
            chainId={swapData.to.chain_id}
            client={props.client}
            decimals={swapData.to.decimals}
            symbol={swapData.to.symbol}
            title="Buy"
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
              className="gap-2"
              client={props.client}
              disabled={
                props.status.type === "sending" ||
                props.status.type === "confirming"
              }
              isLoggedIn={true}
              isPending={props.status.type === "sending"}
              onClick={async () => {
                const tx = prepareTransaction({
                  chain: txChain,
                  client: props.client,
                  data: swapData.transaction.data,
                  erc20Value: isSellingNativeToken
                    ? undefined
                    : {
                        amountWei: BigInt(swapData.from.amount),
                        tokenAddress: swapData.from.address,
                      },
                  to: swapData.transaction.to,
                });

                props.sendTx(tx);
              }}
              size="sm"
              transactionCount={undefined}
              txChainID={swapData.transaction.chainId}
              variant="default"
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
      client={props.client}
      sendTx={(tx) => sendTx(tx, undefined)}
      setStatus={setStatus}
      status={status}
      swapData={props.swapData}
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
  const txChain = defineChain(swapData.transaction.chainId);

  const isTransactionPending =
    props.status.type === "sending" || props.status.type === "confirming";

  return (
    <div className="max-w-lg">
      <div className="rounded-xl border bg-card">
        {/* header */}
        <div className="border-b p-4 py-4 lg:px-5 lg:text-xl">
          <h3 className="font-semibold text-foreground text-lg tracking-tight ">
            Approve
          </h3>
          <p className="text-muted-foreground text-sm">
            Approve spending to swap tokens on your behalf
          </p>
        </div>

        {/* content */}
        <div className="px-4 text-sm lg:px-5 [&>*:not(:last-child)]:border-b [&>*]:min-h-14 [&>*]:py-3.5">
          <TokenRow
            amount={swapData.from.amount}
            chainId={swapData.from.chain_id}
            client={props.client}
            decimals={swapData.from.decimals}
            symbol={swapData.from.symbol}
            title="Approve Spending"
          />

          <TokenRow
            amount={swapData.to.amount}
            chainId={swapData.to.chain_id}
            client={props.client}
            decimals={swapData.to.decimals}
            symbol={swapData.to.symbol}
            title="To Buy"
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
              className="gap-2"
              client={props.client}
              disabled={isTransactionPending}
              isLoggedIn={true}
              isPending={isTransactionPending}
              onClick={async () => {
                const tx = prepareTransaction({
                  chain: txChain,
                  client: props.client,
                  data: swapData.transaction.data,
                  to: swapData.transaction.to,
                });

                props.sendTx(tx);
              }}
              size="sm"
              transactionCount={undefined}
              txChainID={swapData.transaction.chainId}
              variant="default"
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
  chainId: number;
  client: ThirdwebClient;
  title: string;
  decimals: number;
}) {
  const chain = defineChain(props.chainId);
  const tokenDisplayValue = toTokens(BigInt(props.amount), props.decimals);
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-col">
        <div className="font-medium text-muted-foreground">{props.title}</div>
        <div className="text-lg">
          {tokenDisplayValue} {props.symbol}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <ChainIconClient
            className="size-4"
            client={props.client}
            src={chain.icon?.url || ""}
          />
          <div>{chain.name}</div>
        </div>
      </div>
    </div>
  );
}
