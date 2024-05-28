import type { Chain } from "../src/types";
export default {
  "chain": "EthXY",
  "chainId": 969,
  "explorers": [
    {
      "name": "EthXY Network Explorer",
      "url": "https://explorer.ethxy.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://ethxy.com",
  "name": "EthXY",
  "nativeCurrency": {
    "name": "Settled EthXY Token",
    "symbol": "SEXY",
    "decimals": 18
  },
  "networkId": 969,
  "rpc": [
    "https://969.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ethxy.com"
  ],
  "shortName": "sexy",
  "slug": "ethxy",
  "testnet": false
} as const satisfies Chain;