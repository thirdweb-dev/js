import type { Chain } from "../src/types";
export default {
  "chainId": 108801,
  "chain": "BRO",
  "name": "BROChain Mainnet",
  "rpc": [
    "https://brochain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.brochain.org",
    "http://rpc.brochain.org",
    "https://rpc.brochain.org/mainnet",
    "http://rpc.brochain.org/mainnet"
  ],
  "slug": "brochain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Brother",
    "symbol": "BRO",
    "decimals": 18
  },
  "infoURL": "https://brochain.org",
  "shortName": "bro",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "BROChain Explorer",
      "url": "https://explorer.brochain.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;