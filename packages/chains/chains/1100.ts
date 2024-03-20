import type { Chain } from "../src/types";
export default {
  "chain": "Dymension",
  "chainId": 1100,
  "explorers": [
    {
      "name": "dym.fyi",
      "url": "https://dym.fyi",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreic4sjyqikz33xzpcctczvkiwfj44q5i3i7zslycnjiqmyx5ybc3fi",
    "width": 1200,
    "height": 1200,
    "format": "png"
  },
  "infoURL": "https://dymension.xyz",
  "name": "Dymension",
  "nativeCurrency": {
    "name": "DYM",
    "symbol": "DYM",
    "decimals": 18
  },
  "networkId": 1100,
  "rpc": [
    "https://1100.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dymension-evm.blockpi.network/v1/rpc/public",
    "https://dymension-evm-rpc.publicnode.com",
    "wss://dymension-evm-rpc.publicnode.com"
  ],
  "shortName": "dymension",
  "slug": "dymension",
  "testnet": false
} as const satisfies Chain;