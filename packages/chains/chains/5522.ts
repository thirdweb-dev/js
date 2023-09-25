import type { Chain } from "../src/types";
export default {
  "chainId": 5522,
  "chain": "vex",
  "name": "VEX EVM TESTNET",
  "rpc": [
    "https://vex-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.vexascan.com/evmapi"
  ],
  "slug": "vex-evm-testnet",
  "icon": {
    "url": "ipfs://QmcZiEAGFYEEax1uxYnDUh8X5YBvZqMi9K92yZoq4o2zeM",
    "width": 451,
    "height": 446,
    "format": "png"
  },
  "faucets": [
    "https://t.me/vexfaucetbot"
  ],
  "nativeCurrency": {
    "name": "VEX EVM TESTNET",
    "symbol": "VEX",
    "decimals": 18
  },
  "infoURL": "https://vexanium.com",
  "shortName": "VEX",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Vexascan-EVM-TestNet",
      "url": "https://testnet.vexascan.com/evmexplorer",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;