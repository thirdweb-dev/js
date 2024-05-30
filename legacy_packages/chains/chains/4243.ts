import type { Chain } from "../src/types";
export default {
  "chain": "Nexi V2",
  "chainId": 4243,
  "explorers": [
    {
      "name": "nexiscan",
      "url": "https://www.nexiscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.nexi.technology/",
  "name": "Nexi V2 Mainnet",
  "nativeCurrency": {
    "name": "NexiV2",
    "symbol": "NEXI",
    "decimals": 18
  },
  "networkId": 4243,
  "rpc": [
    "https://4243.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain.nexiv2.nexilix.com",
    "https://rpc.chainv1.nexi.technology"
  ],
  "shortName": "NexiV2",
  "slip44": 2500,
  "slug": "nexi-v2",
  "testnet": false
} as const satisfies Chain;