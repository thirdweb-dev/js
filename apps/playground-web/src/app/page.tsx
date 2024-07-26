import {
  PayIcon,
  WalletsAuthIcon,
  WalletsConnectIcon,
  WalletsInAppIcon,
  WalletsSmartIcon,
} from "@/icons";
import { CodeIcon, ConstructionIcon } from "lucide-react";
import Link from "next/link";
import type { PropsWithChildren } from "react";

export default function Page() {
  return (
    <main className="container flex-1">
      <WalletsSection />
    </main>
  );
}

function WalletsSection() {
  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight break-words">
        Connect
      </h2>

      <div className="my-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ArticleCardIndex
          href="/connect/sign-in"
          title="Sign In"
          description="Integrate 350+ web3 wallets, in-app wallets, and smart accounts"
          icon={WalletsConnectIcon}
        />
        <ArticleCardIndex
          href="/connect/account-abstraction"
          title="Account abstraction"
          description="Complete toolkit for Account Abstraction"
          icon={WalletsSmartIcon}
        />
        <ArticleCardIndex
          title="In-App Wallet"
          description="Onboard users with an email, social logins, passkey or your own auth system"
          href="/connect/in-app-wallet"
          icon={WalletsInAppIcon}
        />
        <ArticleCardIndex
          href="/connect/auth"
          title="Auth"
          description="Authenticate users with their wallets"
          icon={WalletsAuthIcon}
        />
        <ArticleCardIndex
          href="/connect/pay"
          title="Pay"
          description="Add fiat and cross-chain crypto payments in your apps"
          icon={PayIcon}
        />
        <ArticleCardIndex
          href="/connect/blockchain-api"
          title="Blockchain API"
          description="Performant, and reliable blockchain API"
          icon={CodeIcon}
        />
      </div>
    </section>
  );
}

/***
 * This component is only for the index page
 */
function ArticleCardIndex(props: {
  title: string;
  description: string;
  href: string;
  icon?: React.FC<{ className?: string }>;
}) {
  return (
    <Link
      href={props.href}
      className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:border-ring hover:bg-ring/20 min-h-32"
    >
      {props.icon && <props.icon className="size-10 shrink-0" />}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold">{props.title}</h3>
        <p className="font-medium text-muted-foreground">{props.description}</p>
      </div>
    </Link>
  );
}

const ComingSoonWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative pointer-events-none rounded-lg overflow-hidden">
      {children}
      <div className="absolute top-0 left-0 h-full w-full backdrop-blur-[2px] bg-color-overlay">
        <div className="flex items-center justify-center h-full space-x-2">
          <ConstructionIcon className="opacity-80" strokeWidth={1} />
          <p className="font-semibold">Coming Soon</p>
        </div>
      </div>
    </div>
  );
};
