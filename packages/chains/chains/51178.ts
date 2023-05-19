import type { Chain } from "../src/types";
export default {
  "name": "Opside Testnet Pre-Alpha",
  "chain": "ETH",
  "rpc": [
    "https://opside-testnet-pre-alpha.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pre-alpha-us-http-geth.opside.network",
    "https://pre-alpha-hk-http-geth.opside.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "IDE Test Token",
    "symbol": "IDE",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://opsi.de/",
  "shortName": "Opside-Testnet",
  "chainId": 51178,
  "networkId": 51178,
  "icon": {
    "url": "ipfs://QmZnE2ygPL2ZGuzHGvFCHmrqxwdurrhz3K1yPnwLzKbgay",
    "width": 401,
    "height": 400,
    "format": "png"
  },
  "explorers": [
    {
      "name": "OpsideTestnetInfo",
      "url": "https://pre-alpha.opside.info",
      "icon": {
        "url": "ipfs://QmZnE2ygPL2ZGuzHGvFCHmrqxwdurrhz3K1yPnwLzKbgay",
        "width": 401,
        "height": 400,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "opside-testnet-pre-alpha"
} as const satisfies Chain;