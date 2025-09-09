import { ArrowRightLeftIcon } from "lucide-react";
import {
  type PreparedTransaction,
  prepareTransaction,
  type ThirdwebClient,
  toEther,
} from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { TransactionButton } from "@/components/tx-button";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { ChainIconClient } from "@/icons/ChainIcon";
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
      client={props.client}
      onTxSettled={props.onTxSettled}
      sendTx={sendTx}
      setStatus={setStatus}
      status={status}
      txData={props.txData}
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
  const chain = useV5DashboardChain(txData.chain_id);
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
                client={props.client}
                src={chain.icon?.url}
              />
              <span className="text-foreground">
                {chain.name || `Chain ID: ${txData.chain_id}`}
              </span>
            </div>
          </div>

          {/* Status */}
          {props.status.type !== "idle" && (
            <TxStatusRow status={props.status} />
          )}

          {/* Transaction Hash */}
          {"txHash" in props.status && props.status.txHash && (
            <TxHashRow chainId={txData.chain_id} txHash={props.status.txHash} />
          )}
        </div>

        {/* footer */}
        {props.status.type !== "confirmed" && (
          <div className="flex items-center justify-end border-t px-4 py-5 lg:px-5">
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
                  chain: chain,
                  client: props.client,
                  data: txData.data,
                  to: txData.to,
                  value: txData.value ? BigInt(txData.value) : undefined,
                });

                props.sendTx(tx, props.onTxSettled);
              }}
              size="sm"
              transactionCount={undefined}
              txChainID={txData.chain_id}
              variant="default"
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
