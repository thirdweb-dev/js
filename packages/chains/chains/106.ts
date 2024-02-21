import type { Chain } from "../src/types";
export default {
  "chain": "Velas",
  "chainId": 106,
  "explorers": [
    {
      "name": "Velas Explorer",
      "url": "https://evmexplorer.velas.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmNXiCXJxEeBd7ZYGYjPSMTSdbDd2nfodLC677gUfk9ku5",
    "width": 924,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://velas.com",
  "name": "Velas EVM Mainnet",
  "nativeCurrency": {
    "name": "Velas",
    "symbol": "VLX",
    "decimals": 18
  },
  "networkId": 106,
  "rpc": [
    "https://106.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmexplorer.velas.com/rpc",
    "https://explorer.velas.com/rpc"
  ],
  "shortName": "vlx",
  "slug": "velas-evm",
  "testnet": false
} as const satisfies Chain;