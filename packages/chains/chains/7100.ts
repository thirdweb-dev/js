import type { Chain } from "../src/types";
export default {
  "chain": "Nume",
  "chainId": 7100,
  "explorers": [
    {
      "name": "numeexplorer",
      "url": "https://explorer.numecrypto.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmNbp1K6vKKFYh7bWeWtjBqKgdH88suDVbztP5CYU3pYNG",
        "width": 1280,
        "height": 1280,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmNbp1K6vKKFYh7bWeWtjBqKgdH88suDVbztP5CYU3pYNG",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "infoURL": "https://numecrypto.com",
  "name": "Nume",
  "nativeCurrency": {
    "name": "Dai Stablecoin",
    "symbol": "DAI",
    "decimals": 18
  },
  "networkId": 7100,
  "rpc": [
    "https://nume.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7100.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.numecrypto.com"
  ],
  "shortName": "nume",
  "slug": "nume",
  "testnet": false,
  "title": "Nume"
} as const satisfies Chain;