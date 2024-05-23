import { StyledConnectButton } from "@/components/styled-connect-button";
import { Button } from "@/components/ui/button";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";
import Link from "next/link";
import { ConnectButtonExample } from "./examples/connect-button";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seemlessly integrate account abstraction and SIWE auth.",
  openGraph: {
    images: [
      {
        url: "/og-image-pay.png",
        width: 1200,
        height: 630,
        alt: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
      },
    ],
  },
};

export default function Page() {
  return (
    <main className="flex-1 content-center relative py-12 md:py-24 lg:py-32 xl:py-48 space-y-12 md:space-y-24 lg:space-y-32 xl:space-y-48">
      <section className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4 min-h-[100%]">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-inter mb-6 text-balance">
                The easiest way for users to sign in to your app
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-300 mb-6 font-inter">
                Let users sign in with their email, phone number, social media
                accounts or directly with a wallet. Seemlessly integrate account
                abstraction and SIWE auth.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link
                  target="_blank"
                  href="https://portal.thirdweb.com/connect/sign-in"
                >
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link target="_blank" href="https://thirdweb.com/contact-us">
                  Book a Demo
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-full mx-auto my-auto sm:w-full lg:order-last relative flex flex-col space-y-2">
            <div className="mx-auto">
              <StyledConnectButton />
            </div>

            <p className="md:text-xl text-center text-muted-foreground">
              <small>👆 This is live, try it out! 👆</small>
            </p>
          </div>
        </div>
      </section>
      <section className="container px-4 md:px-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-semibold tracking-tight">
            Connect Button
          </h2>
          <p className="text-muted-foreground max-w-[600px]">
            When clicked opens a modal and allows users to connect to various
            wallets.
            <br />
            It is extremely customizable and very easy to use.
          </p>
        </div>
        <ConnectButtonExample />
      </section>
    </main>
  );
}
