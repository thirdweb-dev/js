// import type { Metadata } from "next";
import "../../global.css";
import "./nebula-global.css";
import { DashboardRouterTopProgressBar } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { PHProvider } from "lib/posthog/Posthog";
import { PosthogHeadSetup } from "lib/posthog/PosthogHeadSetup";
import { PostHogPageView } from "lib/posthog/PosthogPageView";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { NebulaProviders } from "./providers";

const title =
  "thirdweb Nebula: The Most powerful AI for interacting with the blockchain";
const description =
  "The most powerful AI for interacting with the blockchain, with real-time access to EVM chains and their data";

export async function generateMetadata() {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://nebula---localhost:3000";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: `${appUrl}/assets/nebula/frame/frame.png`,
        button: {
          title: "Start Chatting",
          action: {
            type: "launch_frame",
            name: "Nebula",
            url: appUrl,
            splashImageUrl: `${appUrl}/assets/nebula/frame/ask-nebula-pfp.png`,
            splashBackgroundColor: "#0f172a",
          },
        },
      }),
    },
  };
}

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/nebula/favicon.ico" />
        <PosthogHeadSetup />
      </head>
      <PHProvider disable_session_recording={false}>
        <PostHogPageView />
        <body
          className={cn(
            "bg-background font-sans antialiased",
            fontSans.variable,
          )}
        >
          <NebulaProviders>{props.children}</NebulaProviders>
          <DashboardRouterTopProgressBar />
          <NextTopLoader
            color="hsl(var(--foreground))"
            height={3}
            shadow={false}
            showSpinner={false}
          />
        </body>
      </PHProvider>
    </html>
  );
}
