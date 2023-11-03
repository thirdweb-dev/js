import type { Chain } from "../types";
export default {
  "chain": "TLOS",
  "chainId": 41,
  "explorers": [
    {
      "name": "teloscan",
      "url": "https://testnet.teloscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://app.telos.net/testnet/developers"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmdkgQDtDedsNNth3ZVgWfwRZPCePLA13MtLvV4CEYSuTR/TLOS.png",
    "width": 228,
    "height": 228,
    "format": "png"
  },
  "infoURL": "https://telos.net",
  "name": "Telos EVM Testnet",
  "nativeCurrency": {
    "name": "Telos",
    "symbol": "TLOS",
    "decimals": 18
  },
  "networkId": 41,
  "redFlags": [],
  "rpc": [
    "https://telos-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://41.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.telos.net/evm"
  ],
  "shortName": "TelosEVMTestnet",
  "slug": "telos-evm-testnet",
  "testnet": true
} as const satisfies Chain;