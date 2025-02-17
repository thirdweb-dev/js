import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { BookMarkedIcon, ExternalLinkIcon, MoveRightIcon } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import headerImage from "./assets/header.png";
import { fetchEcosystemList } from "./utils/fetchEcosystemList";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const { team_slug } = await props.params;
  return (
    <EcosystemLandingPage
      ecosystemLayoutPath={`/team/${team_slug}/~/ecosystem`}
    />
  );
}

async function EcosystemLandingPage(props: {
  ecosystemLayoutPath: string;
}) {
  const cookiesManager = await cookies();
  const activeAccount = cookiesManager.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const authToken = activeAccount
    ? cookiesManager.get(`${COOKIE_PREFIX_TOKEN}${activeAccount}`)?.value
    : null;

  // if user is logged in and has an ecosystem, redirect to the first ecosystem
  if (authToken) {
    const ecosystems = await fetchEcosystemList(authToken).catch((err) => {
      console.error("failed to fetch ecosystems", err);
      return [];
    });
    if (ecosystems[0]) {
      redirect(`${props.ecosystemLayoutPath}/${ecosystems[0].slug}`);
    }
  }

  // otherwise we fall through to the page

  return (
    <main className="container mx-auto flex max-w-2xl flex-col gap-8 pb-6">
      <Image
        src={headerImage}
        alt="Ecosystems"
        sizes="100vw"
        className="w-full"
      />
      <div className="flex flex-col gap-2 text-left">
        <h2 className="text-balance font-bold text-2xl text-foreground sm:text-3xl">
          One wallet, a whole ecosystem of apps and games
        </h2>
        <p className="text-muted-foreground">
          With Ecosystem Wallets, your users can access their assets across
          hundreds of apps and games within your ecosystem. You can control
          which apps join your ecosystem and how their users interact with your
          wallet.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
        {!authToken ? (
          <ToolTipLabel label="Connect your wallet to create an ecosystem">
            <Button variant="primary" className="opacity-50">
              Create Ecosystem
            </Button>
          </ToolTipLabel>
        ) : (
          <Button variant="primary" asChild>
            <Link href={`${props.ecosystemLayoutPath}/create`}>
              Create Ecosystem
            </Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link
            href="https://portal.thirdweb.com/connect/ecosystems/overview"
            target="_blank"
            className="flex flex-row gap-2"
          >
            Read The Docs
            <ExternalLinkIcon className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="my-2 h-0 w-full border-t" />
      <Link
        href="https://portal.thirdweb.com/connect/ecosystems/overview"
        className="group mb-6"
      >
        <Card className="flex flex-col gap-3 p-6 md:p-8 md:px-10">
          <div className="flex items-center gap-2">
            <BookMarkedIcon className="size-5 text-muted-foreground" />
            <h4 className="font-bold text-lg">Learn more</h4>
          </div>
          <p className="text-md text-muted-foreground">
            Learn how to create and manage Ecosystem Wallets in our docs.
          </p>
          <div className="mt-4 flex flex-row items-center gap-2 text-md text-primary transition-all group-hover:gap-3 group-hover:text-primary/80">
            View Docs <MoveRightIcon className="size-4" />
          </div>
        </Card>
      </Link>
    </main>
  );
}
