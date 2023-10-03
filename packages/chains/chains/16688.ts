import type { Chain } from "../src/types";
export default {
  "chain": "IRIShub",
  "chainId": 16688,
  "explorers": [
    {
      "name": "IRISHub Testnet Cosmos Explorer (IOBScan)",
      "url": "https://nyancat.iobscan.io",
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
    "url": "ipfs://QmRaSx7AX1VDgcqjwLgSDP4WZmKBHPdHhbjkcEEXPA2Fnc",
    "width": 1062,
    "height": 822,
    "format": "png"
  },
  "infoURL": "https://www.irisnet.org",
  "name": "IRIShub Testnet",
  "nativeCurrency": {
    "name": "Eris",
    "symbol": "ERIS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://irishub-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmrpc.nyancat.irisnet.org"
  ],
  "shortName": "nyancat",
  "slug": "irishub-testnet",
  "testnet": true
} as const satisfies Chain;