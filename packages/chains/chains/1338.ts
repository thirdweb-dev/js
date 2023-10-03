import type { Chain } from "../src/types";
export default {
  "chain": "Elysium",
  "chainId": 1338,
  "explorers": [
    {
      "name": "Elysium testnet explorer",
      "url": "https://elysium-explorer.vulcanforged.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://elysiumscan.vulcanforged.com",
  "name": "Elysium Testnet",
  "nativeCurrency": {
    "name": "LAVA",
    "symbol": "LAVA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://elysium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://elysium-test-rpc.vulcanforged.com"
  ],
  "shortName": "ELST",
  "slug": "elysium-testnet",
  "testnet": true
} as const satisfies Chain;