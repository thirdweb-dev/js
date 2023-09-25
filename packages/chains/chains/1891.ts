import type { Chain } from "../src/types";
export default {
  "chainId": 1891,
  "chain": "Lightlink Pegasus Testnet",
  "name": "Lightlink Pegasus Testnet",
  "rpc": [
    "https://lightlink-pegasus-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://replicator-01.pegasus.lightlink.io/rpc/v1",
    "https://replicator-02.pegasus.lightlink.io/rpc/v1"
  ],
  "slug": "lightlink-pegasus-testnet",
  "icon": {
    "url": "ipfs://QmXMDj6iAFn2ducQcUU1M87PMMdT2jfyL3Tp3Lz5uUD5Lv",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [
    "https://pegasus-faucet-react.vercel.app"
  ],
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://lightlink.io",
  "shortName": "lightlink_pegasus",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "pegasus",
      "url": "https://pegasus.lightlink.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ]
} as const satisfies Chain;