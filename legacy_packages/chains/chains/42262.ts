import type { Chain } from "../src/types";
export default {
  "chain": "Emerald",
  "chainId": 42262,
  "explorers": [
    {
      "name": "Oasis Emerald Explorer",
      "url": "https://explorer.oasis.io/mainnet/emerald",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://docs.oasis.io/dapp/emerald",
  "name": "Oasis Emerald",
  "nativeCurrency": {
    "name": "Emerald Rose",
    "symbol": "ROSE",
    "decimals": 18
  },
  "networkId": 42262,
  "rpc": [
    "https://42262.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://emerald.oasis.io",
    "wss://emerald.oasis.io/ws"
  ],
  "shortName": "emerald",
  "slug": "oasis-emerald",
  "testnet": false
} as const satisfies Chain;