import type { Chain } from "../src/types";
export default {
  "chain": "Lightlink Phoenix Mainnet",
  "chainId": 1890,
  "explorers": [
    {
      "name": "phoenix",
      "url": "https://phoenix.lightlink.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://QmXMDj6iAFn2ducQcUU1M87PMMdT2jfyL3Tp3Lz5uUD5Lv",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://lightlink.io",
  "name": "Lightlink Phoenix Mainnet",
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://lightlink-phoenix.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://replicator-01.phoenix.lightlink.io/rpc/v1",
    "https://replicator-02.phoenix.lightlink.io/rpc/v1"
  ],
  "shortName": "lightlink_phoenix",
  "slug": "lightlink-phoenix",
  "testnet": false
} as const satisfies Chain;