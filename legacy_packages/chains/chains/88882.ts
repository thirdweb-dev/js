import type { Chain } from "../src/types";
export default {
  "chain": "Spicy",
  "chainId": 88882,
  "explorers": [
    {
      "name": "spicy-explorer",
      "url": "https://testnet.chiliscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "Spicy Explorer",
      "url": "http://spicy-explorer.chiliz.com/",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://spicy-faucet.chiliz.com",
    "https://tatum.io/faucets/chiliz",
    "https://spicy-faucet.chiliz.com/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmTGYofJ8VLkeNY4J69AvXi8e126kmbHmf34wLFoJ1FKAK",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://chiliz.com/",
  "name": "Spicy Chain",
  "nativeCurrency": {
    "name": "Chiliz",
    "symbol": "CHZ",
    "decimals": 18
  },
  "networkId": 88882,
  "redFlags": [],
  "rpc": [
    "https://88882.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://spicy-rpc.chiliz.com/",
    "https://spicy-rpc.chiliz.com"
  ],
  "shortName": "Spicy",
  "slip44": 1,
  "slug": "spicy-chain",
  "testnet": true
} as const satisfies Chain;