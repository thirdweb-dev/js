import type { Chain } from "../src/types";
export default {
  "chainId": 106,
  "chain": "Velas",
  "name": "Velas EVM Mainnet",
  "rpc": [
    "https://velas-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmexplorer.velas.com/rpc",
    "https://explorer.velas.com/rpc"
  ],
  "slug": "velas-evm",
  "icon": {
    "url": "ipfs://QmNXiCXJxEeBd7ZYGYjPSMTSdbDd2nfodLC677gUfk9ku5",
    "width": 924,
    "height": 800,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Velas",
    "symbol": "VLX",
    "decimals": 18
  },
  "infoURL": "https://velas.com",
  "shortName": "vlx",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Velas Explorer",
      "url": "https://evmexplorer.velas.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;