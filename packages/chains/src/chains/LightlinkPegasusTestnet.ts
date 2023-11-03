import type { Chain } from "../types";
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
    "https://pegasus-faucet-react.vercel.app"
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
    "https://replicator-01.pegasus.lightlink.io/rpc/v1",
    "https://replicator-02.pegasus.lightlink.io/rpc/v1"
  ],
  "shortName": "lightlink_pegasus",
  "slug": "lightlink-pegasus-testnet",
  "testnet": true
} as const satisfies Chain;