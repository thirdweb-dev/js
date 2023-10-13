import type { Chain } from "../src/types";
export default {
  "chain": "DTH",
  "chainId": 34,
  "explorers": [],
  "faucets": [
    "https://faucet.dithereum.org"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmSHN5GtRGpMMpszSn1hF47ZSLRLqrLxWsQ48YYdJPyjLf",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://dithereum.org",
  "name": "Dithereum Testnet",
  "nativeCurrency": {
    "name": "Dither",
    "symbol": "DTH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://dithereum-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node-testnet.dithereum.io"
  ],
  "shortName": "dth",
  "slug": "dithereum-testnet",
  "testnet": true
} as const satisfies Chain;