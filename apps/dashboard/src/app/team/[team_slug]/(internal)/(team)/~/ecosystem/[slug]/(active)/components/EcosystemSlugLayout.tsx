import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { getEcosystemWalletUsage } from "data/analytics/wallets/ecosystem";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAddress } from "thirdweb";
import { fetchEcosystem } from "../../../utils/fetchEcosystem";
import { EcosystemHeader } from "./ecosystem-header.client";

export async function EcosystemLayoutSlug({
  children,
  params,
  ecosystemLayoutPath,
}: {
  children: React.ReactNode;
  params: { slug: string };
  ecosystemLayoutPath: string;
}) {
  const cookiesManager = await cookies();
  const activeAccount = cookiesManager.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const authToken = activeAccount
    ? (await cookies()).get(COOKIE_PREFIX_TOKEN + getAddress(activeAccount))
        ?.value
    : null;

  if (!authToken) {
    redirect(ecosystemLayoutPath);
  }

  const ecosystem = await fetchEcosystem(params.slug, authToken);

  if (!ecosystem) {
    redirect(ecosystemLayoutPath);
  }

  const allTimeStatsPromise = getEcosystemWalletUsage({
    ecosystemSlug: ecosystem.slug,
    from: new Date(2022, 0, 1),
    to: new Date(),
    period: "all",
  });

  const monthlyStatsPromise = getEcosystemWalletUsage({
    ecosystemSlug: ecosystem.slug,
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
    period: "month",
  });

  const [allTimeStats, monthlyStats] = await Promise.all([
    allTimeStatsPromise,
    monthlyStatsPromise,
  ]);

  return (
    <div className="flex w-full flex-col gap-10">
      <EcosystemHeader
        ecosystem={ecosystem}
        ecosystemLayoutPath={ecosystemLayoutPath}
        allTimeStats={allTimeStats || []}
        monthlyStats={monthlyStats || []}
      />
      {children}
    </div>
  );
}
