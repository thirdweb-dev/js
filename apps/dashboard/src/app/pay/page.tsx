import { cn } from "@workspace/ui/lib/utils";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { defineChain, isAddress } from "thirdweb";
import { PayLandingHeader } from "./landing/header";
import { StyledBuyWidget } from "./landing/styled-buy-widget";

const title = "thirdweb Payments";
const description = "Fast, secure, and simple payments.";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    title,
  },
  title,
};

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

const onlyAddress = (v: string) => (isAddress(v) ? v : undefined);
const onlyNumber = (v: string) =>
  Number.isNaN(Number(v)) ? undefined : Number(v);

/**
 * Validates and normalizes a URL string.
 * Only allows http: and https: protocols with a valid hostname.
 * @returns normalized URL string on success, undefined on failure
 */
const onlyUrl = (v: string): string | undefined => {
  try {
    const url = new URL(v);
    // Only allow http or https protocols
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }
    // Ensure hostname is non-empty
    if (!url.hostname) {
      return undefined;
    }
    // Return normalized URL
    return url.toString();
  } catch {
    // Invalid URL format
    return undefined;
  }
};

export default async function PayPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  const receiver = parse(searchParams.receiver, onlyAddress);
  const token = parse(searchParams.token, onlyAddress);
  const chain = parse(searchParams.chain, onlyNumber);
  const amount = parse(searchParams.amount, onlyNumber);
  const successUrl = parse(searchParams.successUrl, onlyUrl);

  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      enableSystem={false}
    >
      <div className="flex flex-col grow">
        <PayLandingHeader />
        <div className="flex-1 flex items-center justify-center py-20 relative overflow-hidden">
          <DotsBackgroundPattern />
          <StyledBuyWidget
            // eslint-disable-next-line no-restricted-syntax
            chain={chain ? defineChain(chain) : undefined}
            tokenAddress={token}
            receiverAddress={receiver}
            amount={amount ? amount.toString() : undefined}
            successUrl={successUrl}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

function parse<T>(
  value: string | string[] | undefined,
  fn: (value: string) => T | undefined,
): T | undefined {
  if (typeof value === "string") {
    return fn(value);
  }

  return undefined;
}

function DotsBackgroundPattern(props: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -inset-x-36 -inset-y-24 text-foreground/20 dark:text-muted-foreground/20 hidden lg:block",
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
