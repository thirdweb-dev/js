import type { Chain } from "../src/types";
export default {
  "chainId": 5611,
  "chain": "opBNB",
  "name": "Opbnb Testnet",
  "rpc": [
    "https://opbnb-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://opbnb-testnet-rpc.bnbchain.org"
  ],
  "slug": "opbnb-testnet",
  "icon": {
    "url": "ipfs://QmfFvfFsQKby3M32uqr8T55ENBnTHL8bkdeeu6rYVL2n4z/opbnblogo.svg",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [
    "https://opbnb-testnet-bridge.bnbchain.org/"
  ],
  "nativeCurrency": {
    "name": "Testnet bnb",
    "symbol": "Tbnb",
    "decimals": 18
  },
  "infoURL": "https://docs.bnbchain.org/",
  "shortName": "opBNB",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "opBNB Scan",
      "url": "https://opbnbscan.com/",
      "standard": ""
    }
  ],
  "features": []
} as const satisfies Chain;