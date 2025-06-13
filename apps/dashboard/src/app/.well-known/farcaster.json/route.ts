import { NextResponse } from "next/server";

export async function GET() {
  try {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://nebula---localhost:3000";
    const manifest = {
      accountAssociation: {
        header: process.env.NEXT_PUBLIC_FARCASTER_HEADER,
        payload: process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
        signature: process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE,
      },
      frame: {
        version: "1",
        name: "Nebula",
        iconUrl: `${appUrl}/assets/nebula/frame/ask-nebula-pfp.png`,
        imageUrl: `${appUrl}/assets/nebula/frame/frame.png`,
        homeUrl: appUrl,
        splashImageUrl: `${appUrl}/assets/nebula/frame/ask-nebula-pfp.png`,
        splashBackgroundColor: "#171B20",
        subtitle: "Web3 AI Assistant",
        description:
          "Ask questions about your web3 activity, get AI-powered insights about your wallet, and explore blockchain data through natural language",
        primaryCategory: "utility",
        tags: ["ai", "web3", "blockchain", "insights", "wallet"],
        tagline: "Your AI guide to web3",
        ogTitle: "Nebula - Web3 AI Assistant",
        ogDescription:
          "Interact with your wallet data through natural language queries powered by Thirdweb Nebula AI",
        heroImageUrl: `${appUrl}/assets/nebula/frame/screenshot.svg`,
        ogImageUrl: `${appUrl}/assets/nebula/frame/og.svg`,
        screenshotUrls: [
          `${appUrl}/assets/nebula/frame/screenshot.svg`,
          `${appUrl}/assets/nebula/frame/frame.png`,
          `${appUrl}/assets/nebula/frame/og.svg`,
        ],
      },
    };
    return NextResponse.json(manifest);
  } catch (error) {
    console.error("Error generating manifest:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
