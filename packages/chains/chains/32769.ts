import type { Chain } from "../src/types";
export default {
  "name": "Zilliqa EVM",
  "chain": "ZIL",
  "rpc": [
    "https://zilliqa-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.zilliqa.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "infoURL": "https://www.zilliqa.com/",
  "shortName": "zil",
  "chainId": 32769,
  "networkId": 32769,
  "icon": {
    "url": "ipfs://QmTREXNgGtUhSoxFsrkhTe5LUnDBTKL5byaX8kpET6UuKp",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Zilliqa EVM Explorer",
      "url": "https://evmx.zilliqa.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "zilliqa-evm"
} as const satisfies Chain;