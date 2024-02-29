import type { Chain } from "../src/types";
export default {
  "chain": "ZIL",
  "chainId": 32769,
  "explorers": [
    {
      "name": "Zilliqa EVM Explorer",
      "url": "https://evmx.zilliqa.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTREXNgGtUhSoxFsrkhTe5LUnDBTKL5byaX8kpET6UuKp",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "infoURL": "https://www.zilliqa.com/",
  "name": "Zilliqa EVM",
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "networkId": 32769,
  "rpc": [
    "https://32769.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.zilliqa.com"
  ],
  "shortName": "zil",
  "slug": "zilliqa-evm",
  "testnet": false
} as const satisfies Chain;