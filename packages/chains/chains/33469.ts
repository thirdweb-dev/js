import type { Chain } from "../src/types";
export default {
  "chain": "ZIL",
  "chainId": 33469,
  "explorers": [
    {
      "name": "Zilliqa 2 EVM Devnet Explorer",
      "url": "https://explorer.zq2-devnet.zilstg.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.zq2-devnet.zilstg.dev"
  ],
  "icon": {
    "url": "ipfs://QmTREXNgGtUhSoxFsrkhTe5LUnDBTKL5byaX8kpET6UuKp",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "infoURL": "https://www.zilliqa.com/",
  "name": "Zilliqa 2 EVM Devnet",
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "networkId": 33469,
  "rpc": [
    "https://33469.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.zq2-devnet.zilstg.dev"
  ],
  "shortName": "zq2-devnet",
  "slug": "zilliqa-2-evm-devnet",
  "testnet": false
} as const satisfies Chain;