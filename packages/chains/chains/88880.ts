import type { Chain } from "../src/types";
export default {
  "chain": "CHZ",
  "chainId": 88880,
  "explorers": [
    {
      "name": "scoville-explorer",
      "url": "https://scoville-explorer.chiliz.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://scoville-faucet.chiliz.com"
  ],
  "icon": {
    "url": "ipfs://QmYV5xUVZhHRzLy7ie9D8qZeygJHvNZZAxwnB9GXYy6EED",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://www.chiliz.com/en/chain",
  "name": "Chiliz Scoville Testnet",
  "nativeCurrency": {
    "name": "Chiliz",
    "symbol": "CHZ",
    "decimals": 18
  },
  "networkId": 88880,
  "rpc": [
    "https://chiliz-scoville-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://88880.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://scoville-rpc.chiliz.com"
  ],
  "shortName": "chz",
  "slip44": 1,
  "slug": "chiliz-scoville-testnet",
  "testnet": true
} as const satisfies Chain;