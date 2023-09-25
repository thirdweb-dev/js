import type { Chain } from "../src/types";
export default {
  "chainId": 65450,
  "chain": "SCOLWEI",
  "name": "Scolcoin Mainnet",
  "rpc": [
    "https://scolcoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.scolcoin.com"
  ],
  "slug": "scolcoin",
  "icon": {
    "url": "ipfs://QmVES1eqDXhP8SdeCpM85wvjmhrQDXGRquQebDrSdvJqpt",
    "width": 792,
    "height": 822,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Scolcoin",
    "symbol": "SCOL",
    "decimals": 18
  },
  "infoURL": "https://scolcoin.com",
  "shortName": "SRC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Scolscan Explorer",
      "url": "https://explorer.scolcoin.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;