export default {
  "name": "Elysium Mainnet",
  "title": "An L1, carbon-neutral, tree-planting, metaverse dedicated blockchain created by VulcanForged",
  "chain": "Elysium",
  "rpc": [
    "https://elysium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://elysium-rpc.vulcanforged.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LAVA",
    "symbol": "LAVA",
    "decimals": 18
  },
  "infoURL": "https://elysiumscan.vulcanforged.com",
  "shortName": "ELSM",
  "chainId": 1339,
  "networkId": 1339,
  "explorers": [
    {
      "name": "Elysium mainnet explorer",
      "url": "https://explorer.elysiumchain.tech",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "elysium"
} as const;