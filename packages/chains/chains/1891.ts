import type { Chain } from "../src/types";
export default {
  "chain": "Lightlink Pegasus Testnet",
  "chainId": 1891,
  "explorers": [
    {
      "name": "pegasus",
      "url": "https://pegasus.lightlink.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmXMDj6iAFn2ducQcUU1M87PMMdT2jfyL3Tp3Lz5uUD5Lv",
        "width": 200,
        "height": 200,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.pegasus.lightlink.io/"
  ],
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
  "name": "Lightlink Pegasus Testnet",
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1891,
  "rpc": [
    "https://lightlink-pegasus-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1891.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://replicator.pegasus.lightlink.io/rpc/v1"
  ],
  "shortName": "lightlink_pegasus",
  "slip44": 1,
  "slug": "lightlink-pegasus-testnet",
  "testnet": true
} as const satisfies Chain;