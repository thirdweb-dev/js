import type { Chain } from "../src/types";
export default {
  "chain": "DRC",
  "chainId": 1717,
  "explorers": [
    {
      "name": "Doric Explorer",
      "url": "https://explorer.doric.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://doric.network",
  "name": "Doric Network",
  "nativeCurrency": {
    "name": "Doric Native Token",
    "symbol": "DRC",
    "decimals": 18
  },
  "networkId": 1717,
  "rpc": [
    "https://1717.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.doric.network"
  ],
  "shortName": "DRC",
  "slug": "doric-network",
  "testnet": false
} as const satisfies Chain;