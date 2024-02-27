import type { Chain } from "../src/types";
export default {
  "chain": "TBITCI",
  "chainId": 1908,
  "explorers": [
    {
      "name": "Bitci Explorer Testnet",
      "url": "https://testnet.bitciexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.bitcichain.com"
  ],
  "icon": {
    "url": "ipfs://QmbxmfWw5sVMASz5EbR1DCgLfk8PnqpSJGQKpYuEUpoxqn",
    "width": 64,
    "height": 64,
    "format": "svg"
  },
  "infoURL": "https://www.bitcichain.com",
  "name": "Bitcichain Testnet",
  "nativeCurrency": {
    "name": "Test Bitci",
    "symbol": "TBITCI",
    "decimals": 18
  },
  "networkId": 1908,
  "rpc": [
    "https://1908.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bitcichain.com"
  ],
  "shortName": "tbitci",
  "slip44": 1,
  "slug": "bitcichain-testnet",
  "testnet": true
} as const satisfies Chain;