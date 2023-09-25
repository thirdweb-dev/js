import type { Chain } from "../src/types";
export default {
  "chainId": 33101,
  "chain": "ZIL",
  "name": "Zilliqa EVM Testnet",
  "rpc": [
    "https://zilliqa-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dev-api.zilliqa.com"
  ],
  "slug": "zilliqa-evm-testnet",
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
  "testnet": true,
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