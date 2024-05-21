"use client";
import { THIRDWEB_CLIENT } from "@/lib/client";
import Link from "next/link";
import { PayEmbed, ThirdwebProvider } from "thirdweb/react";
import { ThirdwebIcon } from "../icons/thirdweb";

export default function Index() {
  return (
    <ThirdwebProvider>
      <div className="flex flex-col min-h-[100dvh]">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link
            className="flex items-center justify-center"
            target="_blank"
            href="https://thirdweb.com"
          >
            <ThirdwebIcon />
            <span className="sr-only">thirdweb</span>
          </Link>
        </header>
        <main className="flex-1 content-center relative">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 z-10">
            <div className="container px-4 md:px-6">
              <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4 min-h-[100%]">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-inter mb-4 text-balance">
                      Unlock seamless transactions with thirdweb pay
                    </h1>
                    <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-300 font-inter">
                      Thirdweb Pay enables your users to easily purchase
                      cryptocurrencies and execute transactions using their
                      credit or debit card.
                    </p>
                    <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-300 font-inter">
                      Experience hassle-free cross-chain routing and token
                      transactions like never before.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Link
                      className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300 font-inter"
                      target="_blank"
                      href="https://portal.thirdweb.com/connect/pay/get-started"
                    >
                      Get Started
                    </Link>
                    <Link
                      className="inline-flex h-10 items-center justify-center rounded-md border border-gray-20 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300 font-inter"
                      target="_blank"
                      href="https://portal.thirdweb.com/connect/pay/overview"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
                <div className="w-full mx-auto my-auto sm:w-full lg:order-last relative flex flex-col space-y-2">
                  <div className="shadow-xl md:w-[400px] md:mx-auto">
                    <PayEmbed client={THIRDWEB_CLIENT} theme="light" />
                  </div>
                  <p className="text-gray-500 md:text-xl dark:text-gray-300 font-inter text-center">
                    <small>👆 This is live, try it out! 👆</small>
                  </p>
                </div>
              </div>
            </div>
          </section>
          <div
            className="absolute bottom-0 left-0 right-0 h-full z-[-1] bg-cover md:bg-[length:100%_100%] bg-no-repeat"
            style={{
              backgroundImage: "url(bottom-gradient.png)",
            }}
          />
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">
            © 2024 thirdweb. All rights reserved.
          </p>
        </footer>
      </div>
    </ThirdwebProvider>
  );
}
