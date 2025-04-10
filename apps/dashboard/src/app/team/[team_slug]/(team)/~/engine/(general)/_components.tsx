import type { Team } from "@/api/team";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { ArrowRightIcon, DownloadIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { PRO_CONTACT_US_URL } from "../../../../../../../constants/pro";

export function ImportEngineLink(props: {
  label: string;
  engineLinkPrefix: string;
}) {
  return (
    <Button asChild variant="outline" size="sm" className="gap-2 bg-card">
      <TrackedLinkTW
        href={`${props.engineLinkPrefix}/import`}
        category="engine"
        trackingProps={{
          action: "import",
        }}
      >
        <DownloadIcon className="size-3" />
        {props.label}
      </TrackedLinkTW>
    </Button>
  );
}

function EngineInfoSection(props: { team_slug: string }) {
  const engineLinkPrefix = `/team/${props.team_slug}/~/engine`;

  return (
    <div className="">
      <h3 className="mb-1 font-semibold text-lg tracking-tight">
        What is Engine?
      </h3>

      <ul className="list-disc space-y-2 pl-3 text-muted-foreground text-sm">
        <li>Read, write, and deploy contracts at production scale</li>
        <li>
          Reliably parallelize and retry transactions with gas & nonce
          management
        </li>
        <li>Securely manage backend wallets</li>
        <li>Built-in support for account abstraction, relayers, and more</li>
      </ul>

      <div className="mt-4 flex justify-start gap-3">
        <Button asChild variant="outline" size="sm">
          <Link
            href="https://portal.thirdweb.com/engine"
            className="gap-2"
            target="_blank"
          >
            Learn More
            <ExternalLinkIcon className="size-3 text-muted-foreground" />
          </Link>
        </Button>

        <Button size="sm" asChild variant="outline">
          <TrackedLinkTW
            href={`${engineLinkPrefix}/sandbox`}
            className="gap-2"
            category="engine"
            label="click-try-demo"
            trackingProps={{
              action: "try-demo",
            }}
          >
            Try Demo Engine
            <ArrowRightIcon className="size-3 text-muted-foreground" />
          </TrackedLinkTW>
        </Button>
      </div>
    </div>
  );
}

function CloudHostedEngineSection(props: {
  teamPlan: Exclude<Team["billingPlan"], "accelerate" | "scale">;
  teamSlug: string;
}) {
  return (
    <div className="flex flex-col">
      <h3 className="mb-0.5 font-semibold text-lg tracking-tight">
        Get Cloud Hosted Engine
      </h3>

      {props.teamPlan !== "pro" ? (
        <div>
          <p className="text-muted-foreground text-sm">
            Upgrade your plan to{" "}
            <UnderlineLink href="/pricing" target="_blank">
              Accelerate
            </UnderlineLink>{" "}
            or{" "}
            <UnderlineLink href="/pricing" target="_blank">
              Scale
            </UnderlineLink>{" "}
            to get a cloud hosted Engine
          </p>

          <div className="h-5" />
          <div className="flex justify-start gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2 bg-card"
            >
              <Link href={`/team/${props.teamSlug}/~/settings/billing`}>
                Upgrade Plan
                <ArrowRightIcon className="size-3 text-muted-foreground" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2 bg-card"
            >
              <Link href="/pricing" target="_blank">
                View Pricing
                <ExternalLinkIcon className="size-3 text-muted-foreground" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-muted-foreground text-sm">
            Contact us to get a cloud hosted engine for your team
          </p>
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href={PRO_CONTACT_US_URL} target="_blank">
              Contact Us
              <ExternalLinkIcon className="size-3 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export function EngineFooterCard(props: {
  teamPlan: Team["billingPlan"];
  team_slug: string;
}) {
  return (
    <div className="relative rounded-lg border p-6">
      {props.teamPlan === "accelerate" || props.teamPlan === "scale" ? null : (
        <>
          <CloudHostedEngineSection
            teamPlan={props.teamPlan}
            teamSlug={props.team_slug}
          />
          <Separator className="my-5" />
        </>
      )}

      <EngineInfoSection team_slug={props.team_slug} />
    </div>
  );
}
