import type { Chain } from "../src/types";
export default {
  "chainId": 10201,
  "chain": "MaxxChain",
  "name": "MaxxChain Mainnet",
  "rpc": [
    "https://maxxchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.maxxchain.org",
    "https://rpc1.maxxchain.org",
    "https://rpc2.maxxchain.org"
  ],
  "slug": "maxxchain",
  "icon": {
    "url": "ipfs://QmRhQG9TZrXDdbQeTzBmjg3pqgwaD5TKVZj8k4kaz8AoZx",
    "width": 1021,
    "height": 1021,
    "format": "png"
  },
  "faucets": [
    "https://faucet.maxxchain.org"
  ],
  "nativeCurrency": {
    "name": "Power",
    "symbol": "PWR",
    "decimals": 18
  },
  "infoURL": "https://www.maxxchain.org/",
  "shortName": "PWR",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "MaxxChain Block Explorer",
      "url": "https://explorer.maxxchain.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;