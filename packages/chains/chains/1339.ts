import type { Chain } from "../src/types";
export default {
  "chainId": 1339,
  "chain": "Elysium",
  "name": "Elysium Mainnet",
  "rpc": [
    "https://elysium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.elysiumchain.tech/"
  ],
  "slug": "elysium",
  "faucets": [],
  "nativeCurrency": {
    "name": "LAVA",
    "symbol": "LAVA",
    "decimals": 18
  },
  "infoURL": "https://elysiumscan.vulcanforged.com",
  "shortName": "ELSM",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Elysium mainnet explorer",
      "url": "https://explorer.elysiumchain.tech",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;