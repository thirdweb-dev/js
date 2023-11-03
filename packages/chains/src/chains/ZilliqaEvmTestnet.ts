import type { Chain } from "../types";
export default {
  "chain": "ZIL",
  "chainId": 33101,
  "explorers": [
    {
      "name": "Zilliqa EVM Explorer",
      "url": "https://evmx.zilliqa.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://dev-wallet.zilliqa.com/faucet?network=testnet"
  ],
  "infoURL": "https://www.zilliqa.com/",
  "name": "Zilliqa EVM Testnet",
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "networkId": 33101,
  "rpc": [
    "https://zilliqa-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://33101.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dev-api.zilliqa.com"
  ],
  "shortName": "zil-testnet",
  "slug": "zilliqa-evm-testnet",
  "testnet": true
} as const satisfies Chain;