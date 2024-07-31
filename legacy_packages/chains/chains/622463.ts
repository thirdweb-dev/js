import type { Chain } from "../src/types";
export default {
  "chain": "ATLAS",
  "chainId": 622463,
  "explorers": [
    {
      "name": "Atlas Testnet Scan",
      "url": "https://explorer.testnet.atl.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmcSWGcoqC3y8VKahRdqPDgD68rr6A1gWVQPRt5FcpgWmG",
        "width": 587,
        "height": 174,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmcSWGcoqC3y8VKahRdqPDgD68rr6A1gWVQPRt5FcpgWmG",
    "width": 587,
    "height": 174,
    "format": "svg"
  },
  "infoURL": "https://atl.network",
  "name": "Atlas",
  "nativeCurrency": {
    "name": "TON",
    "symbol": "TON",
    "decimals": 18
  },
  "networkId": 622463,
  "rpc": [
    "https://622463.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.atl.network"
  ],
  "shortName": "atlas-testnet",
  "slug": "atlas",
  "testnet": true,
  "title": "Atlas Testnet"
} as const satisfies Chain;