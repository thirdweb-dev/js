import type { Chain } from "../src/types";
export default {
  "chain": "CC2",
  "chainId": 88888,
  "explorers": [
    {
      "name": "cc2scan",
      "url": "https://scan.chiliz.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmTGYofJ8VLkeNY4J69AvXi8e126kmbHmf34wLFoJ1FKAK",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://chiliz.com/chiliz-chain-2-0/",
  "name": "Chiliz Chain",
  "nativeCurrency": {
    "name": "Chiliz",
    "symbol": "CHZ",
    "decimals": 18
  },
  "networkId": 88888,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://chiliz-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://88888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ankr.com/chiliz",
    "https://rpc.chiliz.com"
  ],
  "shortName": "cc2",
  "slug": "chiliz-chain",
  "testnet": false
} as const satisfies Chain;