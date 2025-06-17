import { ChainIconClient } from "@/components/blocks/ChainIcon";
import { TransactionButton } from "@/components/blocks/buttons/TransactionButton";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { ArrowRightLeftIcon } from "lucide-react";
import {
  type PreparedTransaction,
  type ThirdwebClient,
  defineChain,
  prepareTransaction,
  toEther,
} from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import type { NebulaTxData } from "../api/types";
import {
  TxHashRow,
  type TxStatus,
  TxStatusRow,
  useTxSetup,
} from "./Swap/common";

export function ExecuteTransactionCard(props: {
  txData: NebulaTxData;
  client: ThirdwebClient;
  onTxSettled: (txHash: string) => void;
}) {
  const { status, setStatus, sendTx } = useTxSetup();

  return (
    <ExecuteTransactionCardLayout
      txData={props.txData}
      client={props.client}
      status={status}
      setStatus={setStatus}
      sendTx={sendTx}
      onTxSettled={props.onTxSettled}
    />
  );
}

export function ExecuteTransactionCardLayout(props: {
  txData: NebulaTxData;
  client: ThirdwebClient;
  status: TxStatus;
  setStatus: (status: TxStatus) => void;
  onTxSettled: (txHash: string) => void;
  sendTx: (
    tx: PreparedTransaction,
    onTxSettled: (txHash: string) => void,
  ) => Promise<void>;
}) {
  const { txData } = props;
  const chain = defineChain(txData.chainId);
  const account = useActiveAccount();

  return (
    <div>
      <div className="max-w-lg rounded-xl border bg-card">
        {/* header */}
        <h3 className="border-b p-4 py-4 font-semibold text-foreground text-lg tracking-tight lg:px-5 lg:text-xl">
          Transaction
        </h3>

        {/* content */}
        <div className="px-4 text-sm lg:px-5 [&>*:not(:last-child)]:border-b [&>*]:h-[52px]">
          {/* From */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-muted-foreground">From</span>
            {account ? (
              <WalletAddress
                address={account.address}
                className="h-auto py-0"
                client={props.client}
                iconClassName="size-5"
              />
            ) : (
              <span className="text-muted-foreground">Your Wallet</span>
            )}
          </div>

          {/* To */}
          {txData.to && (
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-muted-foreground">To</span>

              <WalletAddress
                address={txData.to}
                className="h-auto py-0"
                client={props.client}
                iconClassName="size-5"
              />
            </div>
          )}

          {/* Value */}
          {txData.value !== undefined && (
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-muted-foreground">Value</span>
              {toEther(BigInt(txData.value))} {chain.nativeCurrency?.symbol}
            </div>
          )}

          {/* Network */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Network</span>
            <div className="flex items-center gap-2">
              <ChainIconClient
                className="size-5 rounded-full"
                src={chain.icon?.url}
                client={props.client}
              />
              <span className="text-foreground">
                {chain.name || `Chain ID: ${txData.chainId}`}
              </span>
            </div>
          </div>

          {/* Status */}
          {props.status.type !== "idle" && (
            <TxStatusRow status={props.status} />
          )}

          {/* Transaction Hash */}
          {"txHash" in props.status && props.status.txHash && (
            <TxHashRow chainId={txData.chainId} txHash={props.status.txHash} />
          )}
        </div>

        {/* footer */}
        {props.status.type !== "confirmed" && (
          <div className="flex items-center justify-end border-t px-4 py-5 lg:px-5">
            <TransactionButton
              client={props.client}
              isPending={props.status.type === "sending"}
              transactionCount={undefined}
              txChainID={txData.chainId}
              variant="default"
              disabled={
                props.status.type === "sending" ||
                props.status.type === "confirming"
              }
              size="sm"
              onClick={async () => {
                const tx = prepareTransaction({
                  chain: chain,
                  client: props.client,
                  data: txData.data,
                  to: txData.to,
                  value: txData.value ? BigInt(txData.value) : undefined,
                });

                props.sendTx(tx, props.onTxSettled);
              }}
              className="gap-2"
              isLoggedIn={true}
            >
              <ArrowRightLeftIcon className="size-4" />
              Execute Transaction
            </TransactionButton>
          </div>
        )}
      </div>
    </div>
  );
}
