import type { Chain } from "../src/types";
export default {
  "chain": "IRIShub",
  "chainId": 6688,
  "explorers": [
    {
      "name": "IRISHub Cosmos Explorer (IOBScan)",
      "url": "https://irishub.iobscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmTKgKs7kJiWDhdjbELE4Y2HVZ36KS4bYkNCbXdsXk66sW",
    "width": 1062,
    "height": 1062,
    "format": "png"
  },
  "infoURL": "https://www.irisnet.org",
  "name": "IRIShub",
  "nativeCurrency": {
    "name": "Eris",
    "symbol": "ERIS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://irishub.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmrpc.irishub-1.irisnet.org",
    "https://iris-evm.publicnode.com",
    "wss://iris-evm.publicnode.com"
  ],
  "shortName": "iris",
  "slug": "irishub",
  "testnet": false
} as const satisfies Chain;