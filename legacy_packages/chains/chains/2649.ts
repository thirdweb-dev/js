import type { Chain } from "../src/types";
export default {
  "chain": "AILayer",
  "chainId": 2649,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://mainnet-explorer.ailayer.xyz",
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
  "name": "AILayer Mainnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 2649,
  "rpc": [
    "https://2649.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.ailayer.xyz",
    "wss://mainnet-rpc.ailayer.xyz"
  ],
  "shortName": "ailayer-mainnet",
  "slug": "ailayer",
  "testnet": false
} as const satisfies Chain;