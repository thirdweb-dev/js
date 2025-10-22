import type { ConnectionOptions } from "@thirdweb-dev/wagmi-adapter";
import { ConnectButton } from "thirdweb/react";
import {
  useAccount,
  useCallsStatus,
  useConnect,
  useDisconnect,
  useSendCalls,
  useSendTransaction,
} from "wagmi";
import { chain, client, thirdwebChainForWallet, wallet } from "./wagmi.js";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    sendTransaction,
    isPending,
    isSuccess,
    isError,
    error: sendTxError,
    data: sendTxData,
  } = useSendTransaction();
  const { sendCalls, data, isPending: isPendingSendCalls } = useSendCalls();
  const {
    data: callStatus,
    isLoading: isLoadingCallStatus,
    error: callStatusError,
  } = useCallsStatus({
    id: data?.id || "",
    query: {
      enabled: !!data?.id,
    },
  });
  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        <ConnectButton
          client={client}
          chain={thirdwebChainForWallet}
          wallets={[wallet]}
          onConnect={(wallet) => {
            // auto connect to wagmi on tw connect
            const twConnector = connectors.find(
              (c) => c.id === "in-app-wallet",
            );
            if (twConnector) {
              const options = {
                wallet,
              } satisfies ConnectionOptions;
              connect({
                connector: twConnector,
                chainId: chain.id,
                ...options,
              });
            }
          }}
        />
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => {
              if (connector.id === "in-app-wallet") {
                const connectOptions = {
                  strategy: "google",
                } satisfies ConnectionOptions;
                connect({
                  connector,
                  chainId: chain.id,
                  ...connectOptions,
                });
              } else {
                connect({ connector, chainId: chain.id });
              }
            }}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
      {account && (
        <div>
          <h2>Transact</h2>
          <button
            onClick={() => sendTransaction({ to: account.address, value: 0n })}
            type="button"
          >
            Send Tx
          </button>
          <button
            onClick={() =>
              sendCalls({
                calls: [
                  {
                    to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
                    value: 0n,
                  },
                ],
              })
            }
            type="button"
          >
            Send Calls
          </button>
          <div>
            {isPending || isPendingSendCalls || isLoadingCallStatus
              ? "Sending..."
              : ""}
          </div>
          <div>
            {isSuccess
              ? `Success: ${sendTxData}`
              : isError
                ? sendTxError?.message
                : ""}
          </div>
          <div>
            {callStatus
              ? `Success: ${JSON.stringify(callStatus, null, 2)}`
              : callStatusError
                ? callStatusError?.message
                : ""}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
