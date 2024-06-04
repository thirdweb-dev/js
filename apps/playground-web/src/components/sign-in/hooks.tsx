"use client";

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
import { Button } from "../ui/button";

export function Hooks() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Custom UI
        </h2>
        <p className="max-w-[600px]">
          Build your own connect UI using react hooks.
          <br />
          Wallet state management is all handled for you.
        </p>
      </div>

      <CodeExample
        preview={<HooksPreview />}
        code={`// Using your own UI
        import { useConnect } from "thirdweb/react";
        import { createWallet } from "thirdweb/wallets";
      
        function App(){
          const { connect } = useConnect();
      
          return (<>
      <button onClick={() => connect(async () => {
        // 350+ wallets supported
        const wallet = createWallet("io.metamask");
        await wallet.connect({ client });
        return wallet;
      })}>Connect with Metamask</button>
      </>);
      };`}
        lang="tsx"
      />
    </>
  );
}

function HooksPreview() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const connectMutation = useConnect();
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
          Connect with Metamask
        </Button>
      )}
    </div>
  );
}
