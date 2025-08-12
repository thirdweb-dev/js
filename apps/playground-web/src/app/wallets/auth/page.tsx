import { LockIcon } from "lucide-react";
import { BasicAuthPreview } from "@/components/auth/basic-auth";
import { GatedContentPreview } from "@/components/auth/gated-content";
import { SmartAccountAuthPreview } from "@/components/auth/smart-account-auth";
import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { BasicAuthHookPreview } from "../../../components/auth/basic-auth-hook";
import { PageLayout } from "../../../components/blocks/APIHeader";
import { createMetadata } from "../../../lib/metadata";

const title = "Authentication (SIWE)";
const description =
  "Add secure wallet authentication to your app using SIWE and JWT. Authenticate users without passwords via Sign-In with Ethereum and backend token validation";

export const metadata = createMetadata({
  description,
  title,
  image: {
    icon: "wallets",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={LockIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/typescript/v5/auth?utm_source=playground"
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
} from "@/app/connect/auth/server/actions/auth";
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
      header={{
        description: "Use smart accounts with Sign in with Ethereum (SIWE)",
        title: "Smart Account Auth",
      }}
      lang="tsx"
      preview={<SmartAccountAuthPreview />}
    />
  );
}
