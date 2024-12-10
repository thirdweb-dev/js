import {
  PayIcon,
  WalletsAuthIcon,
  WalletsConnectIcon,
  WalletsInAppIcon,
  WalletsSmartIcon,
} from "@/icons";
import { CodeIcon } from "lucide-react";
import Link from "next/link";

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
      <h2 className="break-words font-semibold text-2xl tracking-tight md:text-3xl">
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
        <ArticleCardIndex
          href="/connect/ui"
          title="Headless UI"
          description="Modular & composable set of UIs for your web3 applications"
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
      className="flex min-h-32 items-center gap-4 rounded-lg border p-4 transition-colors hover:border-ring hover:bg-ring/20"
    >
      {props.icon && <props.icon className="size-10 shrink-0" />}
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-lg">{props.title}</h3>
        <p className="font-medium text-muted-foreground">{props.description}</p>
      </div>
    </Link>
  );
}
