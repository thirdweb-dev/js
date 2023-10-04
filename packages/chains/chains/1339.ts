import type { Chain } from "../src/types";
export default {
  "chain": "Elysium",
  "chainId": 1339,
  "explorers": [
    {
      "name": "Elysium mainnet explorer",
      "url": "https://explorer.elysiumchain.tech",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://elysiumscan.vulcanforged.com",
  "name": "Elysium Mainnet",
  "nativeCurrency": {
    "name": "LAVA",
    "symbol": "LAVA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://elysium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.elysiumchain.tech/"
  ],
  "shortName": "ELSM",
  "slug": "elysium",
  "testnet": false
} as const satisfies Chain;