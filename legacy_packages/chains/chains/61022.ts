import type { Chain } from "../src/types";
export default {
  "chain": "Orange Chain",
  "chainId": 61022,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://scan.orangechain.xyz",
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
  "name": "Orange Chain Mainnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 61022,
  "rpc": [
    "https://61022.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.orangechain.xyz"
  ],
  "shortName": "Orange-Chain-Mainnet",
  "slug": "orange-chain",
  "testnet": false,
  "title": "Orange Chain Mainnet"
} as const satisfies Chain;