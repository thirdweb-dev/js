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
  "infoURL": "https://elysiumscan.vulcanforged.com",
  "name": "Elysium Mainnet",
  "nativeCurrency": {
    "name": "LAVA",
    "symbol": "LAVA",
    "decimals": 18
  },
  "networkId": 1339,
  "rpc": [
    "https://1339.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.elysiumchain.tech/"
  ],
  "shortName": "ELSM",
  "slug": "elysium",
  "testnet": false,
  "title": "An L1, carbon-neutral, tree-planting, metaverse dedicated blockchain created by VulcanForged"
} as const satisfies Chain;