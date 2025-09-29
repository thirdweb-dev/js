import { CodeServer } from "@workspace/ui/components/code/code.server";
import { CircleDollarSignIcon, Code2Icon } from "lucide-react";
import { CodeExample, TabName } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { PageLayout } from "../../../components/blocks/APIHeader";
import { createMetadata } from "../../../lib/metadata";
import { X402ClientPreview } from "./components/x402-client-preview";

const title = "x402 Payments";
const description =
  "Use the x402 payment protocol to pay for API calls using any web3 wallet.";
const ogDescription =
  "Use the x402 payment protocol to pay for API calls using any web3 wallet.";

export const metadata = createMetadata({
  title,
  description: ogDescription,
  image: {
    icon: "payments",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={CircleDollarSignIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/payments/x402?utm_source=playground"
      >
        <X402Example />
        <div className="h-8" />
        <ServerCodeExample />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function ServerCodeExample() {
  return (
    <>
      <div className="mb-4">
        <h2 className="font-semibold text-xl tracking-tight">
          Next.js Server Code Example
        </h2>
        <p className="max-w-4xl text-muted-foreground text-balance text-sm md:text-base">
          Create middleware with the thirdweb facilitator to settle transactions
          with your server wallet.
        </p>
      </div>
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex grow flex-col border-b md:border-r md:border-b-0">
          <TabName icon={Code2Icon} name="Server Code" />
          <CodeServer
            className="h-full rounded-none border-none"
            code={`// src/middleware.ts

import { facilitator, settlePayment } from "thirdweb/x402";
import { createThirdwebClient } from "thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";

const client = createThirdwebClient({ secretKey: "your-secret-key" });
const thirdwebX402Facilitator = facilitator({
  client,
  serverWalletAddress: "0xYourWalletAddress",
});

export async function middleware(request: NextRequest) {
  const method = request.method.toUpperCase();
  const resourceUrl = request.nextUrl.toString();
  const paymentData = request.headers.get("X-PAYMENT");

  const result = await settlePayment({
    resourceUrl,
    method,
    paymentData,
    payTo: "0xYourWalletAddress",
    network: arbitrumSepolia, // or any other chain
    price: "$0.01", // can also be a ERC20 token amount
    facilitator: thirdwebX402Facilitator,
  });

  if (result.status === 200) {
    // payment successful, execute the request
    return NextResponse.next();
  }

  // otherwise, request payment
  return NextResponse.json(result.responseBody, {
    status: result.status,
    headers: result.responseHeaders,
  });
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/paid-endpoint"],
};

      `}
            lang="tsx"
          />
        </div>
      </div>
    </>
  );
}

function X402Example() {
  return (
    <CodeExample
      header={{
        title: "Client Code Example",
        description:
          "Wrap your fetch requests with the `wrapFetchWithPayment` function to enable x402 payments.",
      }}
      code={`import { createThirdwebClient } from "thirdweb";
import { wrapFetchWithPayment } from "thirdweb/x402";
import { useActiveWallet } from "thirdweb/react";

const client = createThirdwebClient({ clientId: "your-client-id" });

export default function Page() {
  const wallet = useActiveWallet();

  const onClick = async () => {
    const fetchWithPay = wrapFetchWithPayment(fetch, client, wallet);
    const response = await fetchWithPay('/api/paid-endpoint');
  }

  return (
        <Button onClick={onClick}>Pay Now</Button>
  );
}`}
      lang="tsx"
      preview={<X402ClientPreview />}
    />
  );
}
