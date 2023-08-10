import type { Chain } from "../src/types";
export default {
  "name": "Lightlink Phoenix Mainnet",
  "chain": "Lightlink Phoenix Mainnet",
  "icon": {
    "url": "ipfs://QmXMDj6iAFn2ducQcUU1M87PMMdT2jfyL3Tp3Lz5uUD5Lv",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "rpc": [
    "https://lightlink-phoenix.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://replicator-01.phoenix.lightlink.io/rpc/v1",
    "https://replicator-02.phoenix.lightlink.io/rpc/v1"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://lightlink.io",
  "shortName": "lightlink_phoenix",
  "chainId": 1890,
  "networkId": 1890,
  "explorers": [
    {
      "name": "phoenix",
      "url": "https://phoenix.lightlink.io",
      "icon": {
        "url": "ipfs://QmXMDj6iAFn2ducQcUU1M87PMMdT2jfyL3Tp3Lz5uUD5Lv",
        "width": 200,
        "height": 200,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "lightlink-phoenix"
} as const satisfies Chain;