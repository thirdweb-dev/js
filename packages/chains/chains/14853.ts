import type { Chain } from "../src/types";
export default {
  "name": "Humanode Testnet 5 Israfel",
  "chain": "Humanode Testnet 5",
  "rpc": [
    "https://humanode-testnet-5-israfel.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://explorer-rpc-http.testnet5.stages.humanode.io"
  ],
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
  "chainId": 14853,
  "networkId": 14853,
  "explorers": [],
  "testnet": true,
  "slug": "humanode-testnet-5-israfel"
} as const satisfies Chain;