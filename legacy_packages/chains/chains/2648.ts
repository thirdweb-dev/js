import type { Chain } from "../src/types";
export default {
  "chain": "AILayer",
  "chainId": 2648,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer.ailayer.xyz",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYoqc8rm8PrBg9jqfpsrxd6zdPEqDozbyNVMkBo3QMAFP",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYoqc8rm8PrBg9jqfpsrxd6zdPEqDozbyNVMkBo3QMAFP",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://ailayer.xyz/",
  "name": "AILayer Testnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 2648,
  "rpc": [
    "https://2648.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.ailayer.xyz",
    "wss://testnet-rpc.ailayer.xyz"
  ],
  "shortName": "ailayer-testnet",
  "slug": "ailayer-testnet",
  "testnet": true
} as const satisfies Chain;