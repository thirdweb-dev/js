import { BasicAuthPreview } from "@/components/auth/basic-auth";
import { GatedContentPreview } from "@/components/auth/gated-content";
import { SmartAccountAuthPreview } from "@/components/auth/smart-account-auth";
import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { APIHeader } from "../../../components/blocks/APIHeader";

export const metadata: Metadata = {
  metadataBase,
  title: "Auth | thirdweb Connect",
  description:
    "Authenticate users to your backend using only their wallet. This is a secure and easy way to authenticate users without requiring them to create an additional account.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <APIHeader
          title="Auth"
          description={
            <>
              Authenticate users to your backend using only their wallet. This
              is a secure and easy way to authenticate users without requiring
              them to create an additional account.
            </>
          }
          docsLink="https://portal.thirdweb.com/typescript/v5/auth"
          heroLink="/auth.png"
        />

        <section className="space-y-8">
          <BasicAuth />
        </section>

        <div className="h-14" />

        <section className="space-y-8">
          <GatedContent />
        </section>

        <div className="h-14" />

        <section className="space-y-8">
          <SmartAccountAuth />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

function BasicAuth() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Basic Auth
        </h2>
        <p className="max-w-[600px]">
          Add authentication to your app with a single component.
        </p>
      </div>

      <CodeExample
        preview={<BasicAuthPreview />}
        code={`"use client";

import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/connect/auth/server/actions/auth";
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
        lang="tsx"
      />
    </>
  );
}

function GatedContent() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Gating content with Auth
        </h2>
        <p className="max-w-[600px]">
          Protect your page with thirdweb Auth. Deliver exclusive content to
          users who qualify.
        </p>
      </div>

      <CodeExample
        preview={<GatedContentPreview />}
        code={`import { THIRDWEB_CLIENT } from "@/lib/client";
import { cookies } from "next/headers";
import { getAuthResult } from "@/app/connect/auth/server/actions/auth";
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
        lang="tsx"
      />
    </>
  );
}

function SmartAccountAuth() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Smart Account Auth
        </h2>
        <p className="max-w-[600px]">
          Use smart accounts with Sign in with Ethereum (SIWE)
        </p>
      </div>

      <CodeExample
        preview={<SmartAccountAuthPreview />}
        code={`"use client";

import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/connect/auth/server/actions/auth";
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
        lang="tsx"
      />
    </>
  );
}
