import { cn } from "@workspace/ui/lib/utils";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Bridge } from "thirdweb";
import { getPaymentLink } from "@/api/universal-bridge/links";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import {
  API_SERVER_SECRET,
  DASHBOARD_THIRDWEB_SECRET_KEY,
} from "@/constants/server-envs";
import { getConfiguredThirdwebClient } from "@/constants/thirdweb.server";
import { PayPageWidget } from "../components/client/PayPageWidget.client";
import { PayIdPageHeader } from "./header";

const title = "thirdweb Pay";
const description = "Fast, secure, and simple payments.";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    title,
  },
  title,
};

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ redirectUri?: string; theme?: "light" | "dark" }>;
}) {
  const { id } = await params;
  const { redirectUri, theme } = await searchParams;

  const paymentLink = await getPaymentLink({
    paymentId: id,
  });

  const projectMetadataPromise = getProjectMetadata(paymentLink.clientId);

  const tokensPromise = Bridge.tokens({
    client: getConfiguredThirdwebClient({
      secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
      teamId: undefined,
    }),
    chainId: Number(paymentLink.destinationToken.chainId),
    tokenAddress: paymentLink.destinationToken.address,
  });

  const [tokens, projectMetadata] = await Promise.all([
    tokensPromise,
    projectMetadataPromise,
  ]);

  const token = tokens[0];
  if (!token) {
    throw new Error("Token not found");
  }

  return (
    <div className="relative flex flex-col min-h-dvh w-full">
      <ThemeProvider
        defaultTheme={theme === "light" ? "light" : "dark"}
        attribute="class"
        disableTransitionOnChange
        enableSystem={false}
      >
        <PayIdPageHeader
          projectIcon={projectMetadata.image || undefined}
          projectName={projectMetadata.name}
        />

        <main className="flex justify-center py-12 w-full items-center grow overflow-hidden relative">
          <DotsBackgroundPattern />
          <PayPageWidget
            amount={paymentLink.amount ? BigInt(paymentLink.amount) : undefined}
            chainId={Number(paymentLink.destinationToken.chainId)}
            clientId={undefined} // Payment links don't need to use the same client ID to be executed
            image={paymentLink.imageUrl}
            name={paymentLink.title}
            paymentLinkId={id}
            purchaseData={paymentLink.purchaseData}
            recipientAddress={paymentLink.receiver}
            redirectUri={redirectUri}
            token={token}
          />
        </main>
      </ThemeProvider>
    </div>
  );
}

async function getProjectMetadata(clientId: string) {
  const url = new URL(`${NEXT_PUBLIC_THIRDWEB_API_HOST}/v2/keys/lookup`);
  url.searchParams.append("clientId", clientId);
  const response = await fetch(url.toString(), {
    headers: {
      "x-service-api-key": API_SERVER_SECRET,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  const { data } = (await response.json()) as {
    data: { name: string; image: string | null };
  };
  return data;
}

function DotsBackgroundPattern(props: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -inset-x-36 -inset-y-24 text-foreground/20 dark:text-muted-foreground/15 hidden lg:block",
        props.className,
      )}
      style={{
        backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        maskImage:
          "radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 50%)",
      }}
    />
  );
}
