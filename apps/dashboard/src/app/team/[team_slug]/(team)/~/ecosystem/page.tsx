import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../login/loginRedirect";
import headerImage from "./assets/header.png";
import { fetchEcosystemList } from "./utils/fetchEcosystemList";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const { team_slug } = await props.params;
  const ecosystemLayoutPath = `/team/${team_slug}/~/ecosystem`;

  const authToken = await getAuthToken();

  if (!authToken) {
    loginRedirect(ecosystemLayoutPath);
  }

  const ecosystems = await fetchEcosystemList(authToken, team_slug).catch(
    (err) => {
      console.error("failed to fetch ecosystems", err);
      return [];
    },
  );
  if (ecosystems[0]) {
    redirect(`${ecosystemLayoutPath}/${ecosystems[0].slug}`);
  }

  return <EcosystemLandingPage ecosystemLayoutPath={ecosystemLayoutPath} />;
}

async function EcosystemLandingPage(props: {
  ecosystemLayoutPath: string;
}) {
  return (
    <div className="container flex grow flex-col items-center justify-center py-20">
      {/* Card */}
      <div className="flex max-w-lg flex-col rounded-lg border bg-card">
        <Image
          src={headerImage}
          alt="Ecosystems"
          sizes="100vw"
          className="w-full border-b"
        />

        {/* body */}
        <div className="px-4 py-6 lg:px-6">
          <h2 className="mb-2 text-balance font-semibold text-2xl text-foreground leading-tight tracking-tighter">
            One wallet, a whole ecosystem of apps and games
          </h2>

          <p className="text-muted-foreground">
            With Ecosystem Wallets, your users can access their assets across
            hundreds of apps and games within your ecosystem. You can control
            which apps join your ecosystem and how their users interact with
            your wallet.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col justify-end gap-4 border-t px-4 py-6 lg:flex-row lg:px-6">
          <Button variant="outline" asChild>
            <Link
              href="https://portal.thirdweb.com/connect/ecosystems/overview"
              target="_blank"
              className="flex flex-row gap-2"
            >
              Documentation
              <ExternalLinkIcon className="size-4" />
            </Link>
          </Button>

          <Button asChild className="gap-2">
            <Link href={`${props.ecosystemLayoutPath}/create`}>
              Create Ecosystem
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
