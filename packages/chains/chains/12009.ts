import type { Chain } from "../src/types";
export default {
  "chainId": 12009,
  "chain": "SATS",
  "name": "SatoshiChain Mainnet",
  "rpc": [
    "https://satoshichain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.satoshichain.io"
  ],
  "slug": "satoshichain",
  "icon": {
    "url": "ipfs://QmRegpZQBW4o1imYNsW3d27MQjygBSU23Gf6JKje26nvs7",
    "width": 1251,
    "height": 1251,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "SatoshiChain Coin",
    "symbol": "SATS",
    "decimals": 18
  },
  "infoURL": "https://satoshichain.net",
  "shortName": "sats",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "SatoshiChain Explorer",
      "url": "https://satoshiscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;