import type { Chain } from "../src/types";
export default {
  "chain": "Core",
  "chainId": 1115,
  "explorers": [
    {
      "name": "Core Scan Testnet",
      "url": "https://scan.test.btcs.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmdUgiGaD6fGjhb9x1NvfccvEBBFq2YHSm9yb8FNhpwHkW",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://scan.test.btcs.network/faucet"
  ],
  "icon": {
    "url": "ipfs://QmdUgiGaD6fGjhb9x1NvfccvEBBFq2YHSm9yb8FNhpwHkW",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.coredao.org",
  "name": "Core Blockchain Testnet",
  "nativeCurrency": {
    "name": "Core Blockchain Testnet Native Token",
    "symbol": "tCORE",
    "decimals": 18
  },
  "networkId": 1115,
  "rpc": [
    "https://1115.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.test.btcs.network/"
  ],
  "shortName": "tcore",
  "slip44": 1,
  "slug": "core-blockchain-testnet",
  "testnet": true
} as const satisfies Chain;