import type { Chain } from "../types";
export default {
  "chain": "vex",
  "chainId": 5522,
  "explorers": [
    {
      "name": "Vexascan-EVM-TestNet",
      "url": "https://testnet.vexascan.com/evmexplorer",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://t.me/vexfaucetbot"
  ],
  "icon": {
    "url": "ipfs://QmcZiEAGFYEEax1uxYnDUh8X5YBvZqMi9K92yZoq4o2zeM",
    "width": 451,
    "height": 446,
    "format": "png"
  },
  "infoURL": "https://vexanium.com",
  "name": "VEX EVM TESTNET",
  "nativeCurrency": {
    "name": "VEX EVM TESTNET",
    "symbol": "VEX",
    "decimals": 18
  },
  "networkId": 5522,
  "rpc": [
    "https://vex-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5522.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.vexascan.com/evmapi"
  ],
  "shortName": "VEX",
  "slug": "vex-evm-testnet",
  "testnet": true
} as const satisfies Chain;