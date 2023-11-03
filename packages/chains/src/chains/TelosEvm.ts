import type { Chain } from "../types";
export default {
  "chain": "TLOS",
  "chainId": 40,
  "explorers": [
    {
      "name": "teloscan",
      "url": "https://teloscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmdkgQDtDedsNNth3ZVgWfwRZPCePLA13MtLvV4CEYSuTR/TLOS.png",
    "width": 228,
    "height": 228,
    "format": "png"
  },
  "infoURL": "https://telos.net",
  "name": "Telos EVM Mainnet",
  "nativeCurrency": {
    "name": "Telos",
    "symbol": "TLOS",
    "decimals": 18
  },
  "networkId": 40,
  "redFlags": [],
  "rpc": [
    "https://telos-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://40.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.telos.net/evm"
  ],
  "shortName": "TelosEVM",
  "slug": "telos-evm",
  "testnet": false
} as const satisfies Chain;