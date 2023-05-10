import type { Chain } from "../src/types";
export default {
  "name": "IRIShub Testnet",
  "chain": "IRIShub",
  "rpc": [
    "https://irishub-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmrpc.nyancat.irisnet.org"
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
  "shortName": "nyancat",
  "chainId": 16688,
  "networkId": 16688,
  "icon": {
    "url": "ipfs://QmRaSx7AX1VDgcqjwLgSDP4WZmKBHPdHhbjkcEEXPA2Fnc",
    "width": 1062,
    "height": 822,
    "format": "png"
  },
  "explorers": [
    {
      "name": "IRISHub Testnet Cosmos Explorer (IOBScan)",
      "url": "https://nyancat.iobscan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmRaSx7AX1VDgcqjwLgSDP4WZmKBHPdHhbjkcEEXPA2Fnc",
        "width": 1062,
        "height": 822,
        "format": "png"
      }
    }
  ],
  "testnet": true,
  "slug": "irishub-testnet"
} as const satisfies Chain;