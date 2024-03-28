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
  "infoURL": "https://elysiumscan.vulcanforged.com",
  "name": "Elysium Testnet",
  "nativeCurrency": {
    "name": "LAVA",
    "symbol": "LAVA",
    "decimals": 18
  },
  "networkId": 1338,
  "rpc": [
    "https://1338.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://elysium-test-rpc.vulcanforged.com"
  ],
  "shortName": "ELST",
  "slip44": 1,
  "slug": "elysium-testnet",
  "testnet": true,
  "title": "An L1, carbon-neutral, tree-planting, metaverse dedicated blockchain created by VulcanForged"
} as const satisfies Chain;