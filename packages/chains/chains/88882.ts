import type { Chain } from "../src/types";
export default {
  "chainId": 88882,
  "chain": "Spicy",
  "name": "Spicy Chain",
  "rpc": [
    "https://spicy-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://spicy-rpc.chiliz.com/"
  ],
  "slug": "spicy-chain",
  "icon": {
    "url": "ipfs://QmTGYofJ8VLkeNY4J69AvXi8e126kmbHmf34wLFoJ1FKAK",
    "width": 400,
    "height": 400,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Spicy Explorer",
      "url": "http://spicy-explorer.chiliz.com/",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;