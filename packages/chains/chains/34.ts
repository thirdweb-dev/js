import type { Chain } from "../src/types";
export default {
  "chainId": 34,
  "chain": "DTH",
  "name": "Dithereum Testnet",
  "rpc": [
    "https://dithereum-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node-testnet.dithereum.io"
  ],
  "slug": "dithereum-testnet",
  "icon": {
    "url": "ipfs://QmSHN5GtRGpMMpszSn1hF47ZSLRLqrLxWsQ48YYdJPyjLf",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [
    "https://faucet.dithereum.org"
  ],
  "nativeCurrency": {
    "name": "Dither",
    "symbol": "DTH",
    "decimals": 18
  },
  "infoURL": "https://dithereum.org",
  "shortName": "dth",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;