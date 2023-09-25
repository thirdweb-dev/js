import type { Chain } from "../src/types";
export default {
  "chainId": 14853,
  "chain": "Humanode Testnet 5",
  "name": "Humanode Testnet 5 Israfel",
  "rpc": [
    "https://humanode-testnet-5-israfel.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://explorer-rpc-http.testnet5.stages.humanode.io"
  ],
  "slug": "humanode-testnet-5-israfel",
  "faucets": [
    "https://t.me/HumanodeTestnet5FaucetBot"
  ],
  "nativeCurrency": {
    "name": "eHMND",
    "symbol": "eHMND",
    "decimals": 18
  },
  "infoURL": "https://humanode.io",
  "shortName": "hmnd-t5",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;