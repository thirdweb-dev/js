import type { Chain } from "../src/types";
export default {
  "chainId": 1907,
  "chain": "BITCI",
  "name": "Bitcichain Mainnet",
  "rpc": [
    "https://bitcichain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitci.com"
  ],
  "slug": "bitcichain",
  "icon": {
    "url": "ipfs://QmbxmfWw5sVMASz5EbR1DCgLfk8PnqpSJGQKpYuEUpoxqn",
    "width": 64,
    "height": 64,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitci",
    "symbol": "BITCI",
    "decimals": 18
  },
  "infoURL": "https://www.bitcichain.com",
  "shortName": "bitci",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bitci Explorer",
      "url": "https://bitciexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;