import type { Chain } from "../src/types";
export default {
  "chainId": 40,
  "chain": "TLOS",
  "name": "Telos EVM Mainnet",
  "rpc": [
    "https://telos-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.telos.net/evm"
  ],
  "slug": "telos-evm",
  "icon": {
    "url": "ipfs://QmdkgQDtDedsNNth3ZVgWfwRZPCePLA13MtLvV4CEYSuTR/TLOS.png",
    "width": 228,
    "height": 228,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Telos",
    "symbol": "TLOS",
    "decimals": 18
  },
  "infoURL": "https://telos.net",
  "shortName": "TelosEVM",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "teloscan",
      "url": "https://teloscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;