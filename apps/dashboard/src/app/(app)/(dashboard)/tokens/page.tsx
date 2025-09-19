import { BringToFrontIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "./components/header";
import { TokenPage } from "./components/token-page";

const title = "Tokens | thirdweb";
const description = "Discover and swap any tokens on any chain, instantly";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    title,
  },
  title,
};

export default function Page() {
  return (
    <div>
      <PageHeader />
      <div className="border-b py-10 ">
        <div className="container max-w-7xl">
          <div className="flex mb-4">
            <div className="rounded-full bg-card p-2.5 border">
              <BringToFrontIcon className="size-6 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter mb-1">
            Discover and swap any tokens on any chain, instantly
          </h1>
          <Link
            className="text-muted-foreground hover:text-foreground"
            href="https://thirdweb.com/monetize/bridge"
            target="_blank"
          >
            Powered by thirdweb bridge
          </Link>
        </div>
      </div>
      <TokenPage />
    </div>
  );
}
