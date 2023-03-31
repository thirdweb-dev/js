import type { Chain } from "../src/types";
export default {
  "name": "Telos EVM Mainnet",
  "chain": "TLOS",
  "rpc": [
    "https://telos-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.telos.net/evm"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Telos",
    "symbol": "TLOS",
    "decimals": 18
  },
  "infoURL": "https://telos.net",
  "shortName": "TelosEVM",
  "chainId": 40,
  "networkId": 40,
  "explorers": [
    {
      "name": "teloscan",
      "url": "https://teloscan.io",
      "standard": "EIP3091"
    }
  ],
  "icon": {
    "url": "ipfs://QmdkgQDtDedsNNth3ZVgWfwRZPCePLA13MtLvV4CEYSuTR/TLOS.png",
    "format": "png",
    "width": 228,
    "height": 228
  },
  "testnet": false,
  "slug": "telos-evm"
} as const satisfies Chain;