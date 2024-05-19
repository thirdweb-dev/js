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