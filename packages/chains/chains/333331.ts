import type { Chain } from "../src/types";
export default {
  "chainId": 333331,
  "chain": "AVST",
  "name": "Aves Testnet",
  "rpc": [
    "https://aves-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.rpc.avescoin.io"
  ],
  "slug": "aves-testnet",
  "icon": {
    "url": "ipfs://QmeKQVv2QneHaaggw2NfpZ7DGMdjVhPywTdse5RzCs4oGn",
    "width": 232,
    "height": 232,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "AvesT",
    "symbol": "AVST",
    "decimals": 18
  },
  "infoURL": "https://ethereum.org",
  "shortName": "avst",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "avescan",
      "url": "https://testnet.avescoin.io",
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