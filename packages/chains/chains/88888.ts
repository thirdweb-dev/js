import type { Chain } from "../src/types";
export default {
  "chainId": 88888,
  "chain": "CC2",
  "name": "Chiliz Chain",
  "rpc": [
    "https://chiliz-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ankr.com/chiliz",
    "https://rpc.chiliz.com"
  ],
  "slug": "chiliz-chain",
  "icon": {
    "url": "ipfs://QmTGYofJ8VLkeNY4J69AvXi8e126kmbHmf34wLFoJ1FKAK",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Chiliz",
    "symbol": "CHZ",
    "decimals": 18
  },
  "infoURL": "https://chiliz.com/chiliz-chain-2-0/",
  "shortName": "cc2",
  "testnet": false,
  "redFlags": [
    "reusedChainId"
  ],
  "explorers": [
    {
      "name": "cc2scan",
      "url": "https://scan.chiliz.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;