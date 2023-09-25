import type { Chain } from "../src/types";
export default {
  "chainId": 1338,
  "chain": "Elysium",
  "name": "Elysium Testnet",
  "rpc": [
    "https://elysium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://elysium-test-rpc.vulcanforged.com"
  ],
  "slug": "elysium-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "LAVA",
    "symbol": "LAVA",
    "decimals": 18
  },
  "infoURL": "https://elysiumscan.vulcanforged.com",
  "shortName": "ELST",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Elysium testnet explorer",
      "url": "https://elysium-explorer.vulcanforged.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;