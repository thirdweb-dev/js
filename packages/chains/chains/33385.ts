import type { Chain } from "../src/types";
export default {
  "chain": "ZIL",
  "chainId": 33385,
  "explorers": [
    {
      "name": "Zilliqa EVM Devnet Explorer",
      "url": "https://otterscan.devnet.zilliqa.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.devnet.zilliqa.com/"
  ],
  "icon": {
    "url": "ipfs://QmTREXNgGtUhSoxFsrkhTe5LUnDBTKL5byaX8kpET6UuKp",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "infoURL": "https://www.zilliqa.com/",
  "name": "Zilliqa EVM Devnet",
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "networkId": 33385,
  "rpc": [
    "https://zilliqa-evm-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://33385.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.devnet.zilliqa.com/"
  ],
  "shortName": "zil-devnet",
  "slug": "zilliqa-evm-devnet",
  "testnet": false
} as const satisfies Chain;