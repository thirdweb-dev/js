import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import { redirects } from "./redirects.mjs";

const withMDX = createMDX({
	options: {
		remarkPlugins: [remarkGfm],
	},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["mdx", "tsx", "ts"],
	redirects,
	headers: async () => {
		return [
			// Disallow all pages from being embedded in an iframe.
			{
				source: "/:path*",
				headers: [
					{
						key: "Content-Security-Policy",
						value: `frame-ancestors 'none';`,
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
				],
			},
		];
	},
};

export default withMDX(nextConfig);
