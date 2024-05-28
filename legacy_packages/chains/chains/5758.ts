import type { Chain } from "../src/types";
export default {
  "chain": "SATS",
  "chainId": 5758,
  "explorers": [
    {
      "name": "SatoshiChain Testnet Explorer",
      "url": "https://testnet.satoshiscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.satoshichain.io"
  ],
  "infoURL": "https://satoshichain.net",
  "name": "SatoshiChain Testnet",
  "nativeCurrency": {
    "name": "SatoshiChain Coin",
    "symbol": "SATS",
    "decimals": 18
  },
  "networkId": 5758,
  "rpc": [
    "https://5758.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.satoshichain.io"
  ],
  "shortName": "satst",
  "slip44": 1,
  "slug": "satoshichain-testnet",
  "testnet": true
} as const satisfies Chain;