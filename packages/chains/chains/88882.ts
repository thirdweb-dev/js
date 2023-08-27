import type { Chain } from "../src/types";
export default {
  "name": "Spicy Chain",
  "chain": "Spicy",
  "rpc": [
    "https://spicy-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://spicy-rpc.chiliz.com/"
  ],
  "faucets": [
    "https://spicy-faucet.chiliz.com/"
  ],
  "nativeCurrency": {
    "name": "Chiliz",
    "symbol": "CHZ",
    "decimals": 18
  },
  "infoURL": "https://chiliz.com/",
  "shortName": "Spicy",
  "chainId": 88882,
  "networkId": 88882,
  "explorers": [
    {
      "name": "Spicy Explorer",
      "url": "http://spicy-explorer.chiliz.com/",
      "standard": "none"
    }
  ],
  "icon": {
    "url": "ipfs://QmTGYofJ8VLkeNY4J69AvXi8e126kmbHmf34wLFoJ1FKAK",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "testnet": true,
  "slug": "spicy-chain"
} as const satisfies Chain;