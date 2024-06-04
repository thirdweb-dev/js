"use client";

import { useEffect } from "react";
import {
  useActiveAccount,
  useActiveWallet,
  useConnect,
  useDisconnect,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { createWallet } from "thirdweb/wallets";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { CodeExample } from "../code/code-example";
import { StyledConnectButton } from "../styled-connect-button";
import { Button } from "../ui/button";
import { chain } from "./constants";

export function ConnectSmartAccount() {
  // force disconnect if not smart wallet already
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  useEffect(() => {
    if (wallet && wallet.id !== "smart") {
      disconnect(wallet);
    }
  }, [wallet, disconnect]);

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Connect smart accounts
        </h2>
        <p className="max-w-[600px]">
          Enable smart accounts on the UI components or build your own UI.
        </p>
      </div>
      <CodeExample
        preview={<ConnectSmartAccountPreview />}
        code={`// Using UI components
  import { ConnectButton } from "thirdweb/react";

  function App(){
    return (<>
<ConnectButton client={client} 
// account abstraction options
accountAbstraction={{ chain, sponsorGas: true }} />
</>);
};`}
        lang="tsx"
      />
      <CodeExample
        preview={<ConnectSmartAccountCustomPreview />}
        code={`// Using your own UI
  import { useConnect } from "thirdweb/react";
  import { createWallet } from "thirdweb/wallets";

  function App(){
    const { connect } = useConnect({ client, 
      // account abstraction options
      accountAbstraction: { chain, sponsorGas: true }});

    return (<>
<button onClick={() => connect(async () => {
  // any wallet connected here will be
  // converted to a smart account
  const adminWallet = createWallet("io.metamask");
  await adminWallet.connect({ client });
  return adminWallet;
})}>Connect (metamask)</button>
</>);
};`}
        lang="tsx"
      />
    </>
  );
}

function ConnectSmartAccountPreview() {
  return (
    <div className="flex flex-col">
      <StyledConnectButton
        accountAbstraction={{
          chain,
          sponsorGas: true,
        }}
      />
    </div>
  );
}

function ConnectSmartAccountCustomPreview() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const connectMutation = useConnect({
    client: THIRDWEB_CLIENT,
    accountAbstraction: { chain, sponsorGas: true },
  });
  const { disconnect } = useDisconnect();

  const connect = async () => {
    const wallet = await connectMutation.connect(async () => {
      const adminWallet = createWallet("io.metamask");
      await adminWallet.connect({
        client: THIRDWEB_CLIENT,
      });
      return adminWallet;
    });
    return wallet;
  };

  return (
    <div className="flex flex-col">
      {account && wallet ? (
        <>
          <p className="py-4">Connected as {shortenAddress(account.address)}</p>
          <Button variant={"outline"} onClick={() => disconnect(wallet)}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button variant={"default"} onClick={connect}>
          Connect (metamask)
        </Button>
      )}
    </div>
  );
}
