import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 51178,
  "explorers": [
    {
      "name": "OpsideTestnetInfo",
      "url": "https://pre-alpha.opside.info",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmZnE2ygPL2ZGuzHGvFCHmrqxwdurrhz3K1yPnwLzKbgay",
    "width": 401,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://opsi.de/",
  "name": "Opside Testnet Pre-Alpha",
  "nativeCurrency": {
    "name": "IDE Test Token",
    "symbol": "IDE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://opside-testnet-pre-alpha.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pre-alpha-us-http-geth.opside.network",
    "https://pre-alpha-hk-http-geth.opside.network"
  ],
  "shortName": "Opside-Testnet",
  "slug": "opside-testnet-pre-alpha",
  "testnet": true
} as const satisfies Chain;