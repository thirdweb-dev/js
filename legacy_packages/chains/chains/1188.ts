import type { Chain } from "../src/types";
export default {
  "chain": "MOS",
  "chainId": 1188,
  "explorers": [
    {
      "name": "mosscan",
      "url": "https://www.mosscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.mosscan.com",
  "name": "ClubMos Mainnet",
  "nativeCurrency": {
    "name": "ClubMos",
    "symbol": "MOS",
    "decimals": 18
  },
  "networkId": 1188,
  "rpc": [
    "https://1188.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.mosscan.com"
  ],
  "shortName": "MOS",
  "slug": "clubmos",
  "testnet": false
} as const satisfies Chain;