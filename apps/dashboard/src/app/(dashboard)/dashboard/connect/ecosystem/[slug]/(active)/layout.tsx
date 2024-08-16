import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAddress } from "thirdweb";
import type { Ecosystem } from "../../types";
import { EcosystemHeader } from "./components/client/ecosystem-header.client";

async function fetchEcosystem(slug: string, authToken: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com"}/v1/ecosystem-wallet/${slug}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  if (!res.ok) {
    const data = await res.json();
    console.error(data);
    return null;
  }

  const data = (await res.json()) as { result: Ecosystem };
  return data.result;
}

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode; params: { slug: string } }) {
  const cookiesManager = cookies();
  const activeAccount = cookiesManager.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const authToken = activeAccount
    ? cookies().get(COOKIE_PREFIX_TOKEN + getAddress(activeAccount))?.value
    : null;

  if (!authToken) {
    redirect("/dashboard/connect/ecosystem");
  }

  const ecosystem = await fetchEcosystem(params.slug, authToken);

  if (!ecosystem) {
    redirect("/dashboard/connect/ecosystem");
  }

  return (
    <div className="flex flex-col w-full gap-10 px-2 py-10 sm:px-4">
      <EcosystemHeader ecosystem={ecosystem} />
      {children}
    </div>
  );
}

// because cookies() is used
export const dynamic = "force-dynamic";
