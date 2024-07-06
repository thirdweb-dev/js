import type { Chain } from "../src/types";
export default {
  "chain": "ZIL",
  "chainId": 33103,
  "explorers": [
    {
      "name": "Zilliqa 2 EVM proto-testnet explorer",
      "url": "https://explorer.zq2-prototestnet.zilliqa.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.zq2-prototestnet.zilliqa.com"
  ],
  "icon": {
    "url": "ipfs://QmTREXNgGtUhSoxFsrkhTe5LUnDBTKL5byaX8kpET6UuKp",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "infoURL": "https://www.zilliqa.com/",
  "name": "Zilliqa 2 EVM proto-testnet",
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "networkId": 33103,
  "rpc": [
    "https://33103.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.zq2-prototestnet.zilliqa.com"
  ],
  "shortName": "zq2-proto-testnet",
  "slug": "zilliqa-2-evm-proto-testnet",
  "testnet": true
} as const satisfies Chain;