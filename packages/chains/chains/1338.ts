export default {
  "name": "Elysium Testnet",
  "title": "An L1, carbon-neutral, tree-planting, metaverse dedicated blockchain created by VulcanForged",
  "chain": "Elysium",
  "rpc": [
    "https://elysium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://elysium-test-rpc.vulcanforged.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LAVA",
    "symbol": "LAVA",
    "decimals": 18
  },
  "infoURL": "https://elysiumscan.vulcanforged.com",
  "shortName": "ELST",
  "chainId": 1338,
  "networkId": 1338,
  "explorers": [
    {
      "name": "Elysium testnet explorer",
      "url": "https://elysium-explorer.vulcanforged.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "elysium-testnet"
} as const;