import type { Chain } from "../src/types";
export default {
  "name": "SatoshiChain Mainnet",
  "chain": "SATS",
  "icon": {
    "url": "ipfs://QmRegpZQBW4o1imYNsW3d27MQjygBSU23Gf6JKje26nvs7",
    "width": 1251,
    "height": 1251,
    "format": "png"
  },
  "rpc": [
    "https://satoshichain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.satoshichain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SatoshiChain Coin",
    "symbol": "SATS",
    "decimals": 18
  },
  "infoURL": "https://satoshichain.net",
  "shortName": "sats",
  "chainId": 12009,
  "networkId": 12009,
  "explorers": [
    {
      "name": "SatoshiChain Explorer",
      "url": "https://satoshiscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "satoshichain"
} as const satisfies Chain;