import type { Metadata } from "next";
import { BasicAuthPreview } from "@/components/auth/basic-auth";
import { GatedContentPreview } from "@/components/auth/gated-content";
import { SmartAccountAuthPreview } from "@/components/auth/smart-account-auth";
import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import { BasicAuthHookPreview } from "../../../components/auth/basic-auth-hook";
import { PageLayout } from "../../../components/blocks/APIHeader";

export const metadata: Metadata = {
  description:
    "Authenticate users to your backend using only their wallet. This is a secure and easy way to authenticate users without requiring them to create an additional account.",
  metadataBase,
  title: "Auth | thirdweb Connect",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            Authenticate users to your backend using only their wallet. This is
            a secure and easy way to authenticate users without requiring them
            to create an additional account.
          </>
        }
        docsLink="https://portal.thirdweb.com/typescript/v5/auth?utm_source=playground"
        title="Auth"
      >
        <div className="flex flex-col gap-14">
          <BasicAuth />
          <GatedContent />
          <SmartAccountAuth />
          <BasicAuthHook />
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}

function BasicAuth() {
  return (
    <CodeExample
      code={`"use client";

import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/wallets/auth/server/actions/auth";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { ConnectButton } from "thirdweb/react";

export function AuthButton() {
  return (
    <ConnectButton
      client={THIRDWEB_CLIENT}
      auth={{
        // The following methods run on the server (not client)!
        isLoggedIn: async () => {
          const authResult = await isLoggedIn();
          if (!authResult) return false;
          return true;
        },
        doLogin: async (params) => await login(params),
        getLoginPayload: async ({ address }) => generatePayload({ address }),
        doLogout: async () => await logout(),
      }}
    />
  );
}
`}
      header={{
        description: "Add authentication to your app with a single component.",
        title: "Basic Auth",
      }}
      lang="tsx"
      preview={<BasicAuthPreview />}
    />
  );
}

function BasicAuthHook() {
  return (
    <CodeExample
      code={`"use client";

import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/wallets/auth/server/actions/auth";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { type SiweAuthOptions, useConnectModal } from "thirdweb/react";

// server actions
const auth: SiweAuthOptions = {
  isLoggedIn: (address) => isLoggedIn(address),
  doLogin: (params) => login(params),
  getLoginPayload: ({ address }) => generatePayload({ address }),
  doLogout: () => logout(),
};

export function AuthHook() {
  const { connect } = useConnectModal();
  const wallet = useActiveWallet();
  const { isLoggedIn } = useSiweAuth(wallet, wallet?.getAccount(), auth);

  const onClick = () => {
    if (isLoggedIn) {
      auth.doLogout();
    } else {
      connect({
        client: THIRDWEB_CLIENT,
        auth,
      });
    }
  };

  return <Button type="button" onClick={onClick}>{isLoggedIn ? "Sign out" : "Sign in"}</Button>;
}
`}
      header={{
        description:
          "Use the `useConnectModal` hook to add authentication to your app with your own UI.",
        title: "Auth with your own UI",
      }}
      lang="tsx"
      preview={<BasicAuthHookPreview />}
    />
  );
}

function GatedContent() {
  return (
    <CodeExample
      code={`import { THIRDWEB_CLIENT } from "@/lib/client";
import { cookies } from "next/headers";
import { getAuthResult } from "@/app/wallets/auth/server/actions/auth";
import { hasEnoughBalance } from "...";

export async function GatedContentPreview() {
  const jwt = cookies().get("jwt");
  if (!jwt?.value) {
    return <div>
      Log in to see the secret content
    </div>;
  }
  const authResult = await getAuthResult(jwt.value);

  // For this example, we check if a user has more than 10 $TWCOIN
  // If pass -> Allow them to access the page.
  const userAddress = authResult.parsedJWT.sub;
  if (await hasEnoughBalance(userAddress)) {
    return (
      <div className="flex flex-col gap-5">
        You are logged in but you can't view the content
        because you don't own enough TWCOIN
      </div>
    );
  }

  // Finally! We can load the gated content for them now
  return (
    <div>
      Congratulations!
      You can see this message because you own more than 10 TWCOIN.
    </div>
  );
}`}
      header={{
        description:
          "Protect your page with thirdweb Auth. Deliver exclusive content to users who qualify.",
        title: "Gating content with Auth",
      }}
      lang="tsx"
      preview={<GatedContentPreview />}
    />
  );
}

function SmartAccountAuth() {
  return (
    <CodeExample
      code={`"use client";

import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/wallets/auth/server/actions/auth";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { ConnectButton } from "thirdweb/react";
import { defineChain } from "thirdweb";

export function AuthButton() {
  return (
    <ConnectButton
      client={THIRDWEB_CLIENT}
      accountAbstraction={{
        chain: defineChain(17000),
        sponsorGas: true
      }}
      auth={{
        // The following methods run on the server (not client)!
        isLoggedIn: async () => {
          const authResult = await isLoggedIn();
          if (!authResult) return false;
          return true;
        },
        doLogin: async (params) => await login(params),
        getLoginPayload: async ({ address }) => generatePayload({ address }),
        doLogout: async () => await logout(),
      }}
    />
  );
}
`}
      header={{
        description: "Use smart accounts with Sign in with Ethereum (SIWE)",
        title: "Smart Account Auth",
      }}
      lang="tsx"
      preview={<SmartAccountAuthPreview />}
    />
  );
}
