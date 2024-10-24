import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ConnectSDKCard } from "../../../../../components/shared/ConnectSDKCard";
import { getApiKeys } from "../../../../api/lib/getAPIKeys";
import { getAuthToken } from "../../../../api/lib/getAuthToken";

// base page
// - if no keys -> show no keys page
// - else redirect to first key

export default async function Page() {
  const authToken = await getAuthToken();

  if (!authToken) {
    redirect(
      `/login?next=${encodeURIComponent("/dashboard/connect/analytics")}`,
    );
  }

  const apiKeys = await getApiKeys();
  const firstKey = apiKeys[0];

  if (firstKey) {
    redirect(`/dashboard/connect/analytics/${firstKey.key}`);
  }

  return <NoKeysCreatedPage />;
}

function NoKeysCreatedPage() {
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="mb-1 font-semibold text-3xl tracking-tight">
            Connect Analytics
          </h1>
          <p className="text-muted-foreground">
            Visualize how users are connecting to your apps.
          </p>
        </div>
      </div>

      <div className="h-4 lg:h-8" />

      <div className="flex flex-col items-center rounded-lg border border-border bg-muted/50 px-4 py-10 lg:px-6">
        <h3 className="mb-3 font-semibold text-2xl">No API keys found</h3>
        <p className="mb-6 text-muted-foreground text-sm">
          Start using the Connect SDK in your app with a free API key.
        </p>
        <Button asChild variant="primary">
          <Link href="/dashboard/settings/api-keys">Create API Key</Link>
        </Button>
      </div>

      <div className="h-4 lg:h-8" />
      <ConnectSDKCard description="Add the Connect SDK to your app to start collecting analytics." />
    </div>
  );
}
