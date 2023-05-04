import type { Chain } from "../src/types";
export default {
  "name": "Scolcoin Mainnet",
  "chain": "SCOLWEI",
  "rpc": [
    "https://scolcoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.scolcoin.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Scolcoin",
    "symbol": "SCOL",
    "decimals": 18
  },
  "infoURL": "https://scolcoin.com",
  "shortName": "SRC",
  "chainId": 65450,
  "networkId": 65450,
  "icon": {
    "url": "ipfs://QmVES1eqDXhP8SdeCpM85wvjmhrQDXGRquQebDrSdvJqpt",
    "width": 792,
    "height": 822,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Scolscan Explorer",
      "url": "https://explorer.scolcoin.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "scolcoin"
} as const satisfies Chain;