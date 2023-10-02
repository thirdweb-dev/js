import type { Chain } from "../src/types";
export default {
  "name": "Zilliqa 2 EVM Devnet",
  "chain": "ZIL",
  "rpc": [
    "https://zilliqa-2-evm-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.zq2-devnet.zilstg.dev"
  ],
  "faucets": [
    "https://faucet.zq2-devnet.zilstg.dev"
  ],
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "infoURL": "https://www.zilliqa.com/",
  "shortName": "zq2-devnet",
  "chainId": 33469,
  "networkId": 33469,
  "icon": {
    "url": "ipfs://QmTREXNgGtUhSoxFsrkhTe5LUnDBTKL5byaX8kpET6UuKp",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Zilliqa 2 EVM Devnet Explorer",
      "url": "https://explorer.zq2-devnet.zilstg.dev",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "zilliqa-2-evm-devnet"
} as const satisfies Chain;