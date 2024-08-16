import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { NoApiKeys } from "components/settings/ApiKeys/NoApiKeys";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PayUI } from "./components/pay-ui.client";

async function getApiKeys(authToken: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com"}/v1/keys`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  const json = await res.json();

  if (json.error) {
    throw new Error(json.error.message);
  }
  return json.data as ApiKey[];
}

export default async function DashboardConnectPayPage() {
  const cookiesManager = cookies();
  const activeAccount = cookiesManager.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const authToken = activeAccount
    ? cookiesManager.get(`${COOKIE_PREFIX_TOKEN}${activeAccount}`)?.value
    : null;

  if (!authToken) {
    // redirect to login page
    redirect(`/login?next=${encodeURIComponent("/dashboard/connect/pay")}`);
  }

  const apiKeys = await getApiKeys(authToken).catch((err) => {
    console.error("failed to load api keys", err);
    return [];
  });

  return (
    <div className="flex flex-col gap-8 py-6 w-full">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
        <div className="max-w-[800px]">
          <h1 className="text-5xl tracking-tight font-bold mb-5">Pay</h1>
          <p className="text-secondary-foreground leading-7">
            Pay allows your users to purchase cryptocurrencies and execute
            transactions with their credit card or debit card, or with any token
            via cross-chain routing.{" "}
            <Link
              target="_blank"
              href="https://portal.thirdweb.com/connect/pay/overview"
              className="!text-link-foreground"
            >
              Learn more
            </Link>
          </p>
        </div>
      </div>

      {apiKeys.length > 0 ? (
        <PayUI apiKeys={apiKeys} />
      ) : (
        <NoApiKeys
          service="Pay in Connect"
          buttonTextOverride={apiKeys.length ? "Enable Pay" : undefined}
          copyOverride={
            apiKeys.length
              ? "You'll need to enable pay as a service in an API Key to use Pay."
              : undefined
          }
        />
      )}
    </div>
  );
}

// because cookies() is used
export const dynamic = "force-dynamic";
