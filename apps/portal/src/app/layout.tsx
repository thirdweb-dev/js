import "./globals.css";
import { createMetadata } from "@/components/Document";
import { PosthogHeadSetup, PosthogPageView } from "@/lib/posthog/Posthog";
import { Fira_Code, Inter } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { StickyTopContainer } from "../components/Document/StickyTopContainer";
import { Banner } from "../components/others/Banner";
import { EnableSmoothScroll } from "../components/others/SmoothScroll";
import { SetStoredTheme } from "../components/others/theme/theme";
import { Header } from "./Header";

const sansFont = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: "variable",
});

const monoFont = Fira_Code({
	subsets: ["latin"],
	variable: "--font-mono",
	weight: "variable",
});

export const metadata = createMetadata({
	title: "thirdweb docs",
	description: "thirdweb developer portal",
	image: {
		title: "Build apps and games on any EVM chain",
		icon: "thirdweb",
	},
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<PosthogHeadSetup />
				<Script
					src="https://thirdweb.com/js/pl.js"
					defer
					data-domain="portal.thirdweb.com"
					data-api="https://pl.thirdweb.com/api/event"
				/>
			</head>
			<body
				className={`${sansFont.variable} ${monoFont.variable} font-sans`}
				suppressHydrationWarning
			>
				<SetStoredTheme />
				<NextTopLoader
					color="var(--accent-500)"
					height={2}
					shadow={false}
					showSpinner={false}
				/>
				<PosthogPageView />
				<EnableSmoothScroll />

				<div className="relative flex min-h-screen flex-col">
					<StickyTopContainer>
						{/* Note: Please change id as well when changing text or href so that new banner is shown to user even if user dismissed the older one  */}
						<Banner
							id="modular-contracts"
							text="Modular Contracts Beta: Secure, Customizable, and Easy to Integrate contracts"
							href="https://thirdweb.com/explore/modular-contracts"
						/>
						<Header />
					</StickyTopContainer>
					{children}
				</div>
			</body>
		</html>
	);
}
