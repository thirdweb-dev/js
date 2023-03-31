import type { Chain } from "../src/types";
export default {
  "name": "Condrieu",
  "title": "Ethereum Verkle Testnet Condrieu",
  "chain": "ETH",
  "rpc": [
    "https://condrieu.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.condrieu.ethdevops.io:8545"
  ],
  "faucets": [
    "https://faucet.condrieu.ethdevops.io"
  ],
  "nativeCurrency": {
    "name": "Condrieu Testnet Ether",
    "symbol": "CTE",
    "decimals": 18
  },
  "infoURL": "https://condrieu.ethdevops.io",
  "shortName": "cndr",
  "chainId": 69420,
  "networkId": 69420,
  "explorers": [
    {
      "name": "Condrieu explorer",
      "url": "https://explorer.condrieu.ethdevops.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "condrieu"
} as const satisfies Chain;