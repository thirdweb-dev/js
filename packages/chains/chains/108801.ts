import type { Chain } from "../src/types";
export default {
  "chain": "BRO",
  "chainId": 108801,
  "explorers": [
    {
      "name": "BROChain Explorer",
      "url": "https://explorer.brochain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://brochain.org",
  "name": "BROChain Mainnet",
  "nativeCurrency": {
    "name": "Brother",
    "symbol": "BRO",
    "decimals": 18
  },
  "networkId": 108801,
  "rpc": [
    "https://brochain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://108801.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.brochain.org",
    "http://rpc.brochain.org",
    "https://rpc.brochain.org/mainnet",
    "http://rpc.brochain.org/mainnet"
  ],
  "shortName": "bro",
  "slug": "brochain",
  "testnet": false
} as const satisfies Chain;