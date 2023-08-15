import type { Chain } from "../src/types";
export default {
  "name": "MaxxChain Mainnet",
  "chain": "MaxxChain",
  "rpc": [
    "https://maxxchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.maxxchain.org",
    "https://rpc1.maxxchain.org",
    "https://rpc2.maxxchain.org"
  ],
  "faucets": [
    "https://faucet.maxxchain.org"
  ],
  "nativeCurrency": {
    "name": "Power",
    "symbol": "PWR",
    "decimals": 18
  },
  "icon": {
    "url": "ipfs://QmRhQG9TZrXDdbQeTzBmjg3pqgwaD5TKVZj8k4kaz8AoZx",
    "width": 1021,
    "height": 1021,
    "format": "png"
  },
  "infoURL": "https://www.maxxchain.org/",
  "shortName": "PWR",
  "chainId": 10201,
  "networkId": 10201,
  "explorers": [
    {
      "name": "MaxxChain Block Explorer",
      "url": "https://explorer.maxxchain.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "maxxchain"
} as const satisfies Chain;