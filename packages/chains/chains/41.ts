import type { Chain } from "../src/types";
export default {
  "name": "Telos EVM Testnet",
  "chain": "TLOS",
  "rpc": [
    "https://telos-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.telos.net/evm"
  ],
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
  "chainId": 41,
  "networkId": 41,
  "explorers": [
    {
      "name": "teloscan",
      "url": "https://testnet.teloscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "icon": {
    "url": "ipfs://QmdkgQDtDedsNNth3ZVgWfwRZPCePLA13MtLvV4CEYSuTR/TLOS.png",
    "format": "png",
    "width": 228,
    "height": 228
  },
  "slug": "telos-evm-testnet"
} as const satisfies Chain;