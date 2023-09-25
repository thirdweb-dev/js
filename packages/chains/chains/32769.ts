import type { Chain } from "../src/types";
export default {
  "chainId": 32769,
  "chain": "ZIL",
  "name": "Zilliqa EVM",
  "rpc": [
    "https://zilliqa-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.zilliqa.com"
  ],
  "slug": "zilliqa-evm",
  "icon": {
    "url": "ipfs://QmTREXNgGtUhSoxFsrkhTe5LUnDBTKL5byaX8kpET6UuKp",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "infoURL": "https://www.zilliqa.com/",
  "shortName": "zil",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Zilliqa EVM Explorer",
      "url": "https://evmx.zilliqa.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;