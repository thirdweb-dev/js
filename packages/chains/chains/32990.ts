import type { Chain } from "../src/types";
export default {
  "chain": "ZIL",
  "chainId": 32990,
  "explorers": [
    {
      "name": "Zilliqa EVM Isolated Server Explorer",
      "url": "https://devex.zilliqa.com/?network=https://zilliqa-isolated-server.zilliqa.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://dev-wallet.zilliqa.com/faucet?network=isolated_server"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmTREXNgGtUhSoxFsrkhTe5LUnDBTKL5byaX8kpET6UuKp",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "infoURL": "https://www.zilliqa.com/",
  "name": "Zilliqa EVM Isolated Server",
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://zilliqa-evm-isolated-server.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zilliqa-isolated-server.zilliqa.com/"
  ],
  "shortName": "zil-isolated-server",
  "slug": "zilliqa-evm-isolated-server",
  "testnet": false
} as const satisfies Chain;