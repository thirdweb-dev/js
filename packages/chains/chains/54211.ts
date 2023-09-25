import type { Chain } from "../src/types";
export default {
  "chainId": 54211,
  "chain": "TestEdge2",
  "name": "Haqq Chain Testnet",
  "rpc": [
    "https://haqq-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.eth.testedge2.haqq.network"
  ],
  "slug": "haqq-chain-testnet",
  "faucets": [
    "https://testedge2.haqq.network"
  ],
  "nativeCurrency": {
    "name": "Islamic Coin",
    "symbol": "ISLM",
    "decimals": 18
  },
  "infoURL": "https://islamiccoin.net",
  "shortName": "ISLMT",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "TestEdge HAQQ Explorer",
      "url": "https://explorer.testedge2.haqq.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;