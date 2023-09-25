import type { Chain } from "../src/types";
export default {
  "chainId": 16688,
  "chain": "IRIShub",
  "name": "IRIShub Testnet",
  "rpc": [
    "https://irishub-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmrpc.nyancat.irisnet.org"
  ],
  "slug": "irishub-testnet",
  "icon": {
    "url": "ipfs://QmRaSx7AX1VDgcqjwLgSDP4WZmKBHPdHhbjkcEEXPA2Fnc",
    "width": 1062,
    "height": 822,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Eris",
    "symbol": "ERIS",
    "decimals": 18
  },
  "infoURL": "https://www.irisnet.org",
  "shortName": "nyancat",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "IRISHub Testnet Cosmos Explorer (IOBScan)",
      "url": "https://nyancat.iobscan.io",
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