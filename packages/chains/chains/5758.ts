import type { Chain } from "../src/types";
export default {
  "name": "SatoshiChain Testnet",
  "chain": "SATS",
  "icon": {
    "url": "ipfs://QmRegpZQBW4o1imYNsW3d27MQjygBSU23Gf6JKje26nvs7",
    "width": 1251,
    "height": 1251,
    "format": "png"
  },
  "rpc": [
    "https://satoshichain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.satoshichain.io"
  ],
  "faucets": [
    "https://faucet.satoshichain.io"
  ],
  "nativeCurrency": {
    "name": "SatoshiChain Coin",
    "symbol": "SATS",
    "decimals": 18
  },
  "infoURL": "https://satoshichain.net",
  "shortName": "sats",
  "chainId": 5758,
  "networkId": 5758,
  "explorers": [
    {
      "name": "SatoshiChain Explorer",
      "url": "https://satoshiscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "satoshichain-testnet"
} as const satisfies Chain;