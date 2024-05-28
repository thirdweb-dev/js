import type { Chain } from "../src/types";
export default {
  "chain": "ORE",
  "chainId": 7778,
  "explorers": [
    {
      "name": "ORE Mainnet Explorer",
      "url": "https://oreniumscan.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://orenium.org",
  "name": "Orenium Mainnet Protocol",
  "nativeCurrency": {
    "name": "ORENIUM",
    "symbol": "ORE",
    "decimals": 18
  },
  "networkId": 7778,
  "rpc": [
    "https://7778.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://validator-mainnet.orenium.org",
    "https://rpc-oracle-mainnet.orenium.org",
    "https://portalmainnet.orenium.org"
  ],
  "shortName": "ore",
  "slip44": 1,
  "slug": "orenium-protocol",
  "testnet": false
} as const satisfies Chain;