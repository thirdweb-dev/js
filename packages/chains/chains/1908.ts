import type { Chain } from "../src/types";
export default {
  "chainId": 1908,
  "chain": "TBITCI",
  "name": "Bitcichain Testnet",
  "rpc": [
    "https://bitcichain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bitcichain.com"
  ],
  "slug": "bitcichain-testnet",
  "icon": {
    "url": "ipfs://QmbxmfWw5sVMASz5EbR1DCgLfk8PnqpSJGQKpYuEUpoxqn",
    "width": 64,
    "height": 64,
    "format": "svg"
  },
  "faucets": [
    "https://faucet.bitcichain.com"
  ],
  "nativeCurrency": {
    "name": "Test Bitci",
    "symbol": "TBITCI",
    "decimals": 18
  },
  "infoURL": "https://www.bitcichain.com",
  "shortName": "tbitci",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bitci Explorer Testnet",
      "url": "https://testnet.bitciexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;