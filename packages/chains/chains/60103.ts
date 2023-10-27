import type { Chain } from "../src/types";
export default {
  "chain": "Thinkium",
  "chainId": 60103,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test103.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.thinkiumdev.net/faucet"
  ],
  "infoURL": "https://thinkium.net/",
  "name": "Thinkium Testnet Chain 103",
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "networkId": 60103,
  "rpc": [
    "https://thinkium-testnet-chain-103.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://60103.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test103.thinkiumrpc.net/"
  ],
  "shortName": "TKM-test103",
  "slug": "thinkium-testnet-chain-103",
  "testnet": true
} as const satisfies Chain;