import type { Chain } from "../src/types";
export default {
  "chain": "0G-Testnet",
  "chainId": 16600,
  "explorers": [
    {
      "name": "0G Chain Explorer",
      "url": "https://chainscan-newton.0g.ai",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.0g.ai"
  ],
  "icon": {
    "url": "ipfs://bafkreic6mqwxp4g3defk5emaw6hbnimtjhmnxgzh5nje4gsvjgxhl64mqa",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "infoURL": "https://0g.ai",
  "name": "0G-Newton-Testnet",
  "nativeCurrency": {
    "name": "A0GI",
    "symbol": "A0GI",
    "decimals": 18
  },
  "networkId": 16600,
  "rpc": [
    "https://16600.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.0g.ai"
  ],
  "shortName": "0gai-testnet",
  "slug": "0g-newton-testnet",
  "testnet": true
} as const satisfies Chain;