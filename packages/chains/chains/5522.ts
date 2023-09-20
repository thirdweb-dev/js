import type { Chain } from "../src/types";
export default {
  "name": "VEX EVM TESTNET",
  "chain": "vex",
  "icon": {
    "url": "ipfs://QmcZiEAGFYEEax1uxYnDUh8X5YBvZqMi9K92yZoq4o2zeM",
    "width": 451,
    "height": 446,
    "format": "png"
  },
  "rpc": [
    "https://vex-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.vexascan.com/evmapi"
  ],
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
  "chainId": 5522,
  "networkId": 5522,
  "explorers": [
    {
      "name": "Vexascan-EVM-TestNet",
      "url": "https://testnet.vexascan.com/evmexplorer",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "vex-evm-testnet"
} as const satisfies Chain;