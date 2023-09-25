import type { Chain } from "../src/types";
export default {
  "name": "Velas EVM Mainnet",
  "chain": "Velas",
  "icon": "velas",
  "rpc": [
    "https://velas-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmexplorer.velas.com/rpc",
    "https://explorer.velas.com/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Velas",
    "symbol": "VLX",
    "decimals": 18
  },
  "infoURL": "https://velas.com",
  "shortName": "vlx",
  "chainId": 106,
  "networkId": 106,
  "explorers": [
    {
      "name": "Velas Explorer",
      "url": "https://evmexplorer.velas.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "velas-evm"
} as const satisfies Chain;