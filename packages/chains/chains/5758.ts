import type { Chain } from "../src/types";
export default {
  "chainId": 5758,
  "chain": "SATS",
  "name": "SatoshiChain Testnet",
  "rpc": [
    "https://satoshichain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.satoshichain.io"
  ],
  "slug": "satoshichain-testnet",
  "icon": {
    "url": "ipfs://QmRegpZQBW4o1imYNsW3d27MQjygBSU23Gf6JKje26nvs7",
    "width": 1251,
    "height": 1251,
    "format": "png"
  },
  "faucets": [
    "https://faucet.satoshichain.io"
  ],
  "nativeCurrency": {
    "name": "SatoshiChain Coin",
    "symbol": "SATS",
    "decimals": 18
  },
  "infoURL": "https://satoshichain.net",
  "shortName": "satst",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "SatoshiChain Testnet Explorer",
      "url": "https://testnet.satoshiscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;