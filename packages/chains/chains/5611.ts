import type { Chain } from "../src/types";
export default {
  "chain": "opBNB",
  "chainId": 5611,
  "explorers": [
    {
      "name": "opBNB Scan",
      "url": "https://opbnbscan.com/",
      "standard": ""
    }
  ],
  "faucets": [
    "https://opbnb-testnet-bridge.bnbchain.org/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmfFvfFsQKby3M32uqr8T55ENBnTHL8bkdeeu6rYVL2n4z/opbnblogo.svg",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://docs.bnbchain.org/",
  "name": "Opbnb Testnet",
  "nativeCurrency": {
    "name": "Testnet bnb",
    "symbol": "Tbnb",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://opbnb-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://opbnb-testnet-rpc.bnbchain.org"
  ],
  "shortName": "opBNB",
  "slug": "opbnb-testnet",
  "testnet": true
} as const satisfies Chain;