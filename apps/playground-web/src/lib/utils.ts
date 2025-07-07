import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ThirdwebClient } from "thirdweb";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function replaceIpfsUrl(url: string, client: ThirdwebClient): string {
  if (!url) return "";

  // Use thirdweb's IPFS gateway if the URL is an IPFS URL
  if (url.startsWith("ipfs://")) {
    const hash = url.replace("ipfs://", "");
    return `${
      client.config?.storage?.gatewayUrl || "https://ipfs.io/ipfs/"
    }${hash}`;
  }

  // If it's already an HTTP URL, return as-is
  if (url.startsWith("http")) {
    return url;
  }

  // Fallback to original URL
  return url;
}

export const fallbackChainIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCAxMEwxMy4wOSAxNS43NEwxMiAyMkwxMC45MSAxNS43NEw0IDEwTDEwLjkxIDguMjZMMTIgMloiIGZpbGw9IiNGRkZGRkYiLz4KPHN2Zz4KPHN2Zz4K";
