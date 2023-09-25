import type { Chain } from "../src/types";
export default {
  "chainId": 51178,
  "chain": "ETH",
  "name": "Opside Testnet Pre-Alpha",
  "rpc": [
    "https://opside-testnet-pre-alpha.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pre-alpha-us-http-geth.opside.network",
    "https://pre-alpha-hk-http-geth.opside.network"
  ],
  "slug": "opside-testnet-pre-alpha",
  "icon": {
    "url": "ipfs://QmZnE2ygPL2ZGuzHGvFCHmrqxwdurrhz3K1yPnwLzKbgay",
    "width": 401,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "IDE Test Token",
    "symbol": "IDE",
    "decimals": 18
  },
  "infoURL": "https://opsi.de/",
  "shortName": "Opside-Testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "OpsideTestnetInfo",
      "url": "https://pre-alpha.opside.info",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;