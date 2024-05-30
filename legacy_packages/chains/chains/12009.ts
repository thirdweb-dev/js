import type { Chain } from "../src/types";
export default {
  "chain": "SATS",
  "chainId": 12009,
  "explorers": [
    {
      "name": "SatoshiChain Explorer",
      "url": "https://satoshiscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://satoshichain.net",
  "name": "SatoshiChain Mainnet",
  "nativeCurrency": {
    "name": "SatoshiChain Coin",
    "symbol": "SATS",
    "decimals": 18
  },
  "networkId": 12009,
  "rpc": [
    "https://12009.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.satoshichain.io"
  ],
  "shortName": "sats",
  "slug": "satoshichain",
  "testnet": false
} as const satisfies Chain;