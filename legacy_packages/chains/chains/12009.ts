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
  "icon": {
    "url": "ipfs://QmRegpZQBW4o1imYNsW3d27MQjygBSU23Gf6JKje26nvs7",
    "width": 1251,
    "height": 1251,
    "format": "png"
  },
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