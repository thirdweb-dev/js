import type { Chain } from "../src/types";
export default {
  "chain": "Humanode Testnet 5",
  "chainId": 14853,
  "explorers": [],
  "faucets": [
    "https://t.me/HumanodeTestnet5FaucetBot"
  ],
  "features": [],
  "infoURL": "https://humanode.io",
  "name": "Humanode Testnet 5 Israfel",
  "nativeCurrency": {
    "name": "eHMND",
    "symbol": "eHMND",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://humanode-testnet-5-israfel.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://explorer-rpc-http.testnet5.stages.humanode.io"
  ],
  "shortName": "hmnd-t5",
  "slug": "humanode-testnet-5-israfel",
  "testnet": true
} as const satisfies Chain;