import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 34443,
  "explorers": [
    {
      "name": "modescout",
      "url": "https://explorer.mode.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://docs.mode.network/",
  "name": "Mode",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 34443,
  "rpc": [
    "https://34443.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.mode.network",
    "https://mode.drpc.org",
    "wss://mode.drpc.org"
  ],
  "shortName": "mode",
  "slug": "mode",
  "testnet": false
} as const satisfies Chain;