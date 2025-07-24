import {
  ArrowLeftRightIcon,
  ArrowUpRightIcon,
  BadgeDollarSignIcon,
  BellDotIcon,
  CoinsIcon,
  HammerIcon,
  LinkIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { loginRedirect } from "@/utils/redirects";
import { FeatureCard } from "./components/FeatureCard.client";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  searchParams: Promise<{
    from?: string | undefined | string[];
    to?: string | undefined | string[];
    interval?: string | undefined | string[];
  }>;
}) {
  const [params, authToken] = await Promise.all([props.params, getAuthToken()]);

  const project = await getProject(params.team_slug, params.project_slug);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/payments`);
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const searchParams = await props.searchParams;

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Earn Fees"
            description="Setup fees to earn any time a user swaps or bridges funds."
            icon={<BadgeDollarSignIcon className="size-5" />}
            id="earn_fees"
            link={{
              href: `/team/${params.team_slug}/${params.project_slug}/payments/settings`,
              label: "Configure",
            }}
          />
          <FeatureCard
            title="Create Payment Links"
            description="Create shareable URLs to receive any token in seconds."
            icon={<LinkIcon className="size-5" />}
            id="create_payment_links"
            link={{
              href: `/pay`,
              label: "Create",
            }}
          />
          <FeatureCard
            title="Sell Your Token"
            description="Allow users to swap from any token to your token from your app."
            icon={<ArrowLeftRightIcon className="size-5" />}
            id="sell_your_token"
            link={{
              href: `/team/${params.team_slug}/${params.project_slug}/tokens`,
              label: "Launch Token",
            }}
          />
          <FeatureCard
            title="Get Notified"
            description="Create Webhooks to get notified on each purchase or transaction."
            icon={<BellDotIcon className="size-5" />}
            id="get_notified"
            link={{
              href: `/team/${params.team_slug}/${params.project_slug}/payments/webhooks`,
              label: "Setup",
            }}
          />
          <FeatureCard
            title="Sell Products"
            description="Sell physical or digital products with an easy-to-configure component."
            icon={<CoinsIcon className="size-5" />}
            id="sell_products"
            link={{
              href: "https://portal.thirdweb.com/payments/products",
              label: "Get Started",
              target: "_blank",
            }}
          />
          <FeatureCard
            title="Customize Your Experience"
            description="Fully customizable backend API to create your own branded flows."
            icon={<HammerIcon className="size-5" />}
            id="customize_your_experience"
            link={{
              href: "https://payments.thirdweb.com/reference",
              label: "Docs",
              target: "_blank",
            }}
          />
        </div>

        <div className="h-10" />
        <div className="relative overflow-hidden rounded-lg border-2 border-green-500/20 bg-gradient-to-br from-card/80 to-card/50 p-4 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.02)]">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
          <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-lg">Get Started with Payments</h3>
              <p className="text-muted-foreground text-sm">
                Simple, instant, and secure payments across any token and chain.
              </p>
            </div>
            <a
              className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-sm text-white transition-all hover:bg-green-600/90 hover:shadow-sm"
              href="https://portal.thirdweb.com/payments"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn More
              <ArrowUpRightIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </ResponsiveSearchParamsProvider>
  );
}
