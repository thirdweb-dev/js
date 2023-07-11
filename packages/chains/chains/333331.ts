import type { Chain } from "../src/types";
export default {
  "name": "Aves Testnet",
  "chain": "AVST",
  "rpc": [
    "https://aves-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.rpc.avescoin.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "AvesT",
    "symbol": "AVST",
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
  "infoURL": "https://ethereum.org",
  "shortName": "avst",
  "chainId": 333331,
  "networkId": 333331,
  "icon": {
    "url": "ipfs://QmeKQVv2QneHaaggw2NfpZ7DGMdjVhPywTdse5RzCs4oGn",
    "width": 232,
    "height": 232,
    "format": "png"
  },
  "explorers": [
    {
      "name": "avescan",
      "url": "https://testnet.avescoin.io",
      "icon": {
        "url": "ipfs://QmeKQVv2QneHaaggw2NfpZ7DGMdjVhPywTdse5RzCs4oGn",
        "width": 232,
        "height": 232,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "aves-testnet"
} as const satisfies Chain;