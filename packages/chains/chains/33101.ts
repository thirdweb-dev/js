import type { Chain } from "../src/types";
export default {
  "name": "Zilliqa EVM Testnet",
  "chain": "ZIL",
  "rpc": [
    "https://zilliqa-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dev-api.zilliqa.com"
  ],
  "faucets": [
    "https://dev-wallet.zilliqa.com/faucet?network=testnet"
  ],
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "infoURL": "https://www.zilliqa.com/",
  "shortName": "zil-testnet",
  "chainId": 33101,
  "networkId": 33101,
  "explorers": [
    {
      "name": "Zilliqa EVM Explorer",
      "url": "https://evmx.zilliqa.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "zilliqa-evm-testnet"
} as const satisfies Chain;