import type { Chain } from "../src/types";
export default {
  "chain": "Orange Chain",
  "chainId": 240515,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet-scan.orangechain.xyz",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmWcaVLcPYBxi76HYJc4qudLJwXtfNCDJieLHAs632jMEA",
        "width": 1042,
        "height": 1042,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWcaVLcPYBxi76HYJc4qudLJwXtfNCDJieLHAs632jMEA",
    "width": 1042,
    "height": 1042,
    "format": "png"
  },
  "infoURL": "https://orangechain.xyz",
  "name": "Orange Chain Testnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 240515,
  "rpc": [
    "https://240515.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.orangechain.xyz"
  ],
  "shortName": "Orange-Chain-Testnet",
  "slug": "orange-chain-testnet",
  "testnet": true,
  "title": "Orange Chain Testnet"
} as const satisfies Chain;