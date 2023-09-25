import type { Chain } from "../src/types";
export default {
  "chainId": 88880,
  "chain": "CHZ",
  "name": "Chiliz Scoville Testnet",
  "rpc": [
    "https://chiliz-scoville-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://scoville-rpc.chiliz.com"
  ],
  "slug": "chiliz-scoville-testnet",
  "icon": {
    "url": "ipfs://QmYV5xUVZhHRzLy7ie9D8qZeygJHvNZZAxwnB9GXYy6EED",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [
    "https://scoville-faucet.chiliz.com"
  ],
  "nativeCurrency": {
    "name": "Chiliz",
    "symbol": "CHZ",
    "decimals": 18
  },
  "infoURL": "https://www.chiliz.com/en/chain",
  "shortName": "chz",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "scoville-explorer",
      "url": "https://scoville-explorer.chiliz.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;