import type { Chain } from "../src/types";
export default {
  "name": "Zilliqa EVM Isolated Server",
  "chain": "ZIL",
  "rpc": [
    "https://zilliqa-evm-isolated-server.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zilliqa-isolated-server.zilliqa.com/"
  ],
  "faucets": [
    "https://dev-wallet.zilliqa.com/faucet?network=isolated_server"
  ],
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "infoURL": "https://www.zilliqa.com/",
  "shortName": "zil-isolated-server",
  "chainId": 32990,
  "networkId": 32990,
  "icon": {
    "url": "ipfs://QmTREXNgGtUhSoxFsrkhTe5LUnDBTKL5byaX8kpET6UuKp",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Zilliqa EVM Isolated Server Explorer",
      "url": "https://devex.zilliqa.com/?network=https://zilliqa-isolated-server.zilliqa.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "zilliqa-evm-isolated-server"
} as const satisfies Chain;