import type { Chain } from "../src/types";
export default {
  "chain": "AVST",
  "chainId": 333331,
  "explorers": [
    {
      "name": "avescan",
      "url": "https://testnet.avescoin.io",
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
    "url": "ipfs://QmeKQVv2QneHaaggw2NfpZ7DGMdjVhPywTdse5RzCs4oGn",
    "width": 232,
    "height": 232,
    "format": "png"
  },
  "infoURL": "https://ethereum.org",
  "name": "Aves Testnet",
  "nativeCurrency": {
    "name": "AvesT",
    "symbol": "AVST",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://aves-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.rpc.avescoin.io"
  ],
  "shortName": "avst",
  "slug": "aves-testnet",
  "testnet": true
} as const satisfies Chain;