"use client";
import { thirdwebClient } from "@/lib/thirdweb-client";
import { useTheme } from "next-themes";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { getContract, sendAndConfirmTransaction } from "thirdweb";
import type { Chain, ThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import {
  addSessionKey,
  shouldUpdateSessionKey,
} from "thirdweb/extensions/erc4337";
import {
  ConnectButton,
  ConnectEmbed,
  useActiveAccount,
  useActiveWallet,
  useSiweAuth,
} from "thirdweb/react";
import { type Account, inAppWallet } from "thirdweb/wallets";
import { createCode } from "../actions/create-code";
import {
  doLogin,
  doLogout,
  getLoginPayload,
  isLoggedIn,
} from "../actions/siwe";
import type { LoginConfig } from "../api/login/config";
import type { Oauth2AuthorizeParams } from "../lib/oauth";
import { PermissionCard, type PermissionState } from "./permission-card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function LoginForm(props: {
  config: LoginConfig;
  oauthParams: Oauth2AuthorizeParams;
}) {
  const { resolvedTheme } = useTheme();

  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();

  const siweAuth = useSiweAuth(activeWallet, activeAccount, {
    getLoginPayload: getLoginPayload,
    doLogin: doLogin,
    doLogout: doLogout,
    isLoggedIn: isLoggedIn,
  });

  // render the logged in state
  if (activeAccount && siweAuth.isLoggedIn) {
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <ConnectButton
                accountAbstraction={{
                  sponsorGas: true,
                  chain: defineChain(props.config.chainId),
                }}
                theme={resolvedTheme === "light" ? "light" : "dark"}
                client={thirdwebClient}
                wallets={[
                  inAppWallet({
                    auth: {
                      options: props.config.authOptions,
                    },
                    smartAccount: {
                      sponsorGas: true,
                      chain: defineChain(props.config.chainId),
                    },
                  }),
                ]}
              />
            </div>
          </CardContent>
        </Card>
        <PermissionCard
          name={props.config.name}
          permissions={props.config.permissions}
          onAccept={async (permissions) => {
            const t = toast.loading("Adding session key...", {
              dismissible: false,
            });
            try {
              // TODO: allow for an array of chainIds here
              // should switch chain and add session key for each chainId
              await ensureSessionKey({
                account: activeAccount,
                client: thirdwebClient,
                chain: defineChain(props.config.chainId),
                sessionKeySignerAddress: props.config.sessionKeySignerAddress,
                permissions,
              });

              toast.loading("Finishing up...", {
                id: t,
              });

              await createCode({
                permissions,
                oauthParams: props.oauthParams,
              });

              toast.success("Login successful", {
                id: t,
              });
            } catch (err) {
              console.error(err);
              toast.error("Failed to add session key", {
                id: t,
              });
            }
          }}
          onDeny={() => {
            redirect(props.oauthParams.redirect_uri);
          }}
        />
      </div>
    );
  }

  return (
    <ConnectEmbed
      accountAbstraction={{
        sponsorGas: true,
        chain: defineChain(props.config.chainId),
      }}
      theme={resolvedTheme === "light" ? "light" : "dark"}
      client={thirdwebClient}
      wallets={[
        inAppWallet({
          auth: {
            options: props.config.authOptions,
          },
          smartAccount: {
            sponsorGas: true,
            chain: defineChain(props.config.chainId),
          },
        }),
      ]}
      auth={{
        getLoginPayload: getLoginPayload,
        doLogin: doLogin,
        doLogout: doLogout,
        isLoggedIn: isLoggedIn,
      }}
    />
  );
}

async function ensureSessionKey(options: {
  account: Account;
  client: ThirdwebClient;
  chain: Chain;
  sessionKeySignerAddress: string;
  permissions: PermissionState;
}) {
  const accountContract = getContract({
    address: options.account.address,
    chain: options.chain,
    client: options.client,
  });

  const newPermissions = {
    approvedTargets:
      typeof options.permissions["contracts:write"] === "boolean"
        ? ("*" as const)
        : options.permissions["contracts:write"],
    permissionEndTimestamp: options.permissions.expiration,
    nativeTokenLimitPerTransaction: options.permissions["native:spend"],
  };

  const needsUpdate = await shouldUpdateSessionKey({
    accountContract,
    sessionKeyAddress: options.sessionKeySignerAddress,
    newPermissions,
  });

  // check if already added
  if (!needsUpdate) {
    return {
      success: true,
      message: "Session key already added",
      transaction: null,
    };
  }
  // if not added or needs to be updated, send tx to add the session key
  const tx = await sendAndConfirmTransaction({
    account: options.account,
    transaction: addSessionKey({
      account: options.account,
      contract: accountContract,
      sessionKeyAddress: options.sessionKeySignerAddress,
      permissions: newPermissions,
    }),
  });

  return {
    success: true,
    message: "Session key added",
    transaction: tx,
  };
}
