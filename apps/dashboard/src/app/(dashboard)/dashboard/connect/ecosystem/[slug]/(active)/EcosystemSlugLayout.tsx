import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAddress } from "thirdweb";
import { fetchEcosystem } from "../../utils/fetchEcosystem";
import { EcosystemHeader } from "./components/client/ecosystem-header.client";

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
    ? (await cookies()).get(COOKIE_PREFIX_TOKEN + getAddress(activeAccount))?.value
    : null;

  if (!authToken) {
    redirect(ecosystemLayoutPath);
  }

  const ecosystem = await fetchEcosystem(params.slug, authToken);

  if (!ecosystem) {
    redirect(ecosystemLayoutPath);
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <EcosystemHeader
        ecosystem={ecosystem}
        ecosystemLayoutPath={ecosystemLayoutPath}
      />
      {children}
    </div>
  );
}
