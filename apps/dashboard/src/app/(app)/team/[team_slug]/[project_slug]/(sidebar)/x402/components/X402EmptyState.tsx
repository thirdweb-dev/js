import { CodeServer } from "@/components/ui/code/code.server";
import { WaitingForIntegrationCard } from "../../components/WaitingForIntegrationCard/WaitingForIntegrationCard";

export function X402EmptyState(props: { walletAddress?: string }) {
  return (
    <WaitingForIntegrationCard
      codeTabs={[
        {
          code: (
            <CodeServer
              className="bg-background"
              code={jsCode(props.walletAddress)}
              lang="ts"
            />
          ),
          label: "JavaScript",
        },
      ]}
      ctas={[
        {
          href: "https://portal.thirdweb.com/x402",
          label: "View Docs",
        },
      ]}
      title="Start Monetizing your API"
    />
  );
}

const jsCode = (walletAddress?: string) => `\
import { createThirdwebClient } from "thirdweb";
import { facilitator, settlePayment } from "thirdweb/x402";
import { arbitrumSepolia } from "thirdweb/chains";

const client = createThirdwebClient({ secretKey: "your-secret-key" });

const thirdwebX402Facilitator = facilitator({
  client,
  serverWalletAddress: "${walletAddress || "0xYourWalletAddress"}",
});

export async function GET(request: Request) {
  // process the payment
  const result = await settlePayment({
    resourceUrl: "https://api.example.com/premium-content",
    method: "GET",
    paymentData: request.headers.get("x-payment"),
    network: arbitrumSepolia,
    price: "$0.01",
    facilitator: thirdwebX402Facilitator,
  });
  
  if (result.status === 200) {
    // Payment successful, continue to app logic
    return Response.json({ data: "premium content" });
  } else {
    return Response.json(result.responseBody, {
      status: result.status,
      headers: result.responseHeaders,
    });
  }
}
`;
