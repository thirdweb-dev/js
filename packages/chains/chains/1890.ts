import type { Chain } from "../src/types";
export default {
  "chainId": 1890,
  "chain": "Lightlink Phoenix Mainnet",
  "name": "Lightlink Phoenix Mainnet",
  "rpc": [
    "https://lightlink-phoenix.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://replicator-01.phoenix.lightlink.io/rpc/v1",
    "https://replicator-02.phoenix.lightlink.io/rpc/v1"
  ],
  "slug": "lightlink-phoenix",
  "icon": {
    "url": "ipfs://QmXMDj6iAFn2ducQcUU1M87PMMdT2jfyL3Tp3Lz5uUD5Lv",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://lightlink.io",
  "shortName": "lightlink_phoenix",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "phoenix",
      "url": "https://phoenix.lightlink.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ]
} as const satisfies Chain;