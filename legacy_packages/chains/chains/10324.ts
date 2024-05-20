import type { Chain } from "../src/types";
export default {
  "chain": "TAO EVM",
  "chainId": 10324,
  "explorers": [
    {
      "name": "TAO Testnet Explorer",
      "url": "https://testnet.taoscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.taoevm.io"
  ],
  "icon": {
    "url": "ipfs://QmS78hUX5zqYDqoFgyVmtWpCcx7bZW86Nhw5Nqt2GJrLh2",
    "width": 256,
    "height": 234,
    "format": "png"
  },
  "infoURL": "https://taoevm.io",
  "name": "TAO EVM Testnet",
  "nativeCurrency": {
    "name": "TAO",
    "symbol": "TAO",
    "decimals": 18
  },
  "networkId": 10324,
  "rpc": [
    "https://10324.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.taoevm.io"
  ],
  "shortName": "TAOt",
  "slug": "tao-evm-testnet",
  "testnet": true
} as const satisfies Chain;