import type { Chain } from "../src/types";
export default {
  "name": "IRIShub",
  "chain": "IRIShub",
  "rpc": [
    "https://irishub.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmrpc.irishub-1.irisnet.org",
    "https://iris-evm.publicnode.com",
    "wss://iris-evm.publicnode.com"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Eris",
    "symbol": "ERIS",
    "decimals": 18
  },
  "infoURL": "https://www.irisnet.org",
  "shortName": "iris",
  "chainId": 6688,
  "networkId": 6688,
  "icon": {
    "url": "ipfs://QmTKgKs7kJiWDhdjbELE4Y2HVZ36KS4bYkNCbXdsXk66sW",
    "width": 1062,
    "height": 1062,
    "format": "png"
  },
  "explorers": [
    {
      "name": "IRISHub Cosmos Explorer (IOBScan)",
      "url": "https://irishub.iobscan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmTKgKs7kJiWDhdjbELE4Y2HVZ36KS4bYkNCbXdsXk66sW",
        "width": 1062,
        "height": 1062,
        "format": "png"
      }
    }
  ],
  "testnet": false,
  "slug": "irishub"
} as const satisfies Chain;