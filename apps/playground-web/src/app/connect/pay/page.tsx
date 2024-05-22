"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import Link from "next/link";
import { PayEmbed } from "thirdweb/react";
import { Button } from "../../../components/ui/button";

export default function Page() {
  const { theme } = useTheme();

  return (
    <main className="flex-1 content-center relative">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 z-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4 min-h-[100%]">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-inter mb-6 text-balance">
                  The easiest way for users to transact in your app
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-300 mb-6 font-inter">
                  Onramp users in clicks with credit card &amp; cross-chain
                  crypto payments — and generate revenue for each user
                  transaction. Integrate for free.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link
                    target="_blank"
                    href="https://portal.thirdweb.com/connect/pay/get-started"
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
              <div className="shadow-xl md:w-[400px] md:mx-auto">
                <PayEmbed
                  client={THIRDWEB_CLIENT}
                  // we invert here to make it stand out more
                  theme={theme === "light" ? "dark" : "light"}
                />
              </div>
              <p className="md:text-xl text-center text-muted-foreground">
                <small>👆 This is live, try it out! 👆</small>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
