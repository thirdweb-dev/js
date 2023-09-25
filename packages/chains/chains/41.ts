import type { Chain } from "../src/types";
export default {
  "chainId": 41,
  "chain": "TLOS",
  "name": "Telos EVM Testnet",
  "rpc": [
    "https://telos-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.telos.net/evm"
  ],
  "slug": "telos-evm-testnet",
  "icon": {
    "url": "ipfs://QmdkgQDtDedsNNth3ZVgWfwRZPCePLA13MtLvV4CEYSuTR/TLOS.png",
    "width": 228,
    "height": 228,
    "format": "png"
  },
  "faucets": [
    "https://app.telos.net/testnet/developers"
  ],
  "nativeCurrency": {
    "name": "Telos",
    "symbol": "TLOS",
    "decimals": 18
  },
  "infoURL": "https://telos.net",
  "shortName": "TelosEVMTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "teloscan",
      "url": "https://testnet.teloscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;