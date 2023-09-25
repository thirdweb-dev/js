import type { Chain } from "../src/types";
export default {
  "chainId": 6688,
  "chain": "IRIShub",
  "name": "IRIShub",
  "rpc": [
    "https://irishub.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmrpc.irishub-1.irisnet.org",
    "https://iris-evm.publicnode.com",
    "wss://iris-evm.publicnode.com"
  ],
  "slug": "irishub",
  "icon": {
    "url": "ipfs://QmTKgKs7kJiWDhdjbELE4Y2HVZ36KS4bYkNCbXdsXk66sW",
    "width": 1062,
    "height": 1062,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Eris",
    "symbol": "ERIS",
    "decimals": 18
  },
  "infoURL": "https://www.irisnet.org",
  "shortName": "iris",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "IRISHub Cosmos Explorer (IOBScan)",
      "url": "https://irishub.iobscan.io",
      "standard": "none"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;