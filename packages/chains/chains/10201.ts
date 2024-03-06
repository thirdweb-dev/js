import type { Chain } from "../src/types";
export default {
  "chain": "MaxxChain",
  "chainId": 10201,
  "explorers": [
    {
      "name": "MaxxChain Block Explorer",
      "url": "https://explorer.maxxchain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.maxxchain.org"
  ],
  "icon": {
    "url": "ipfs://QmRhQG9TZrXDdbQeTzBmjg3pqgwaD5TKVZj8k4kaz8AoZx",
    "width": 1021,
    "height": 1021,
    "format": "png"
  },
  "infoURL": "https://www.maxxchain.org/",
  "name": "MaxxChain Mainnet",
  "nativeCurrency": {
    "name": "Power",
    "symbol": "PWR",
    "decimals": 18
  },
  "networkId": 10201,
  "rpc": [
    "https://10201.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.maxxchain.org",
    "https://rpc1.maxxchain.org",
    "https://rpc2.maxxchain.org"
  ],
  "shortName": "PWR",
  "slug": "maxxchain",
  "testnet": false
} as const satisfies Chain;