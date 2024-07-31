export const dynamic = "force-dynamic";

import { BasicAuthPreview } from "@/components/auth/basic-auth";
import { GatedContentPreview } from "@/components/auth/gated-content";
import { CodeExample } from "@/components/code/code-example";
import { Button } from "@/components/ui/button";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase,
  title: "Auth | thirdweb Connect",
  description: "lorem ipsum",
};

export default function Page({
  searchParams,
}: { searchParams: { message: string } }) {
  return (
    <main className="flex-1 content-center relative py-12 md:py-24 lg:py-32 xl:py-48 space-y-12 md:space-y-24">
      <section className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4 min-h-[100%]">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-inter mb-6 text-balance">
                Auth
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-300 mb-6 font-inter">
                Authenticate users to your backend using only their wallet. This
                is a secure and easy way to authenticate users without requiring
                them to create an additional account.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link
                  target="_blank"
                  href="https://portal.thirdweb.com/typescript/v5/auth"
                >
                  View docs
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link target="_blank" href="https://thirdweb.com/contact-us">
                  Book a Demo
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-full mx-auto my-auto sm:w-full order-first lg:order-last relative flex flex-col space-y-2">
            <div className="max-w-full sm:max-w-[600px]">
              <Image
                src={"/auth.png"}
                width={600}
                height={400}
                objectFit={"contain"}
                alt=""
                priority={true}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <BasicAuth />
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <GatedContent />
      </section>
    </main>
  );
}

function BasicAuth() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
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
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
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
