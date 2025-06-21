"use client";
import { baseSepolia } from "thirdweb/chains";
import { useActiveAccount, useLinkProfile, useProfiles } from "thirdweb/react";
import { createWallet, type WalletId } from "thirdweb/wallets";
import { THIRDWEB_CLIENT } from "../../lib/client";
import CodeClient, { CodeLoading } from "../code/code.client";
import { StyledConnectButton } from "../styled-connect-button";
import { Button } from "../ui/button";

export function LinkedAccounts() {
  const account = useActiveAccount();
  const { data: profiles } = useProfiles({
    client: THIRDWEB_CLIENT,
  });

  return (
    <div className="flex flex-col gap-4 p-6">
      {account ? (
        <div>
          <CodeClient
            code={JSON.stringify(profiles || [], null, 2)}
            lang={"json"}
            loader={<CodeLoading />}
          />
        </div>
      ) : (
        <StyledConnectButton />
      )}
    </div>
  );
}

export function LinkAccount() {
  const { mutate: linkProfile, isPending, error } = useLinkProfile();
  const account = useActiveAccount();
  const linkWallet = async (walletId: WalletId) => {
    linkProfile({
      chain: baseSepolia,
      client: THIRDWEB_CLIENT,
      strategy: "wallet",
      wallet: createWallet(walletId),
    });
  };

  const linkPasskey = async () => {
    linkProfile({
      client: THIRDWEB_CLIENT,
      strategy: "passkey",
      type: "sign-up",
    });
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      {account ? (
        <>
          {isPending ? (
            <p>Linking...</p>
          ) : (
            <>
              {/*
              TODO make cb smart wallet linking work
              <Button
                variant="default"
                onClick={() => linkWallet("com.coinbase.wallet")}
                className="rounded-full p-6"
                disabled={isPending}
              >
                Link Coinbase Wallet
              </Button> */}
              <Button
                className="rounded-full p-6"
                disabled={isPending}
                onClick={() => linkWallet("io.metamask")}
                variant="default"
              >
                Link MetaMask
              </Button>
              <Button
                className="rounded-full p-6"
                disabled={isPending}
                onClick={linkPasskey}
                variant="default"
              >
                Link Passkey
              </Button>
            </>
          )}
          {error && <p className="text-red-500">Error: {error.message}</p>}
        </>
      ) : (
        <StyledConnectButton />
      )}
    </div>
  );
}
