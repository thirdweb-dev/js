import type { Chain } from "../src/types";
export default {
  "chainId": 6552,
  "chain": "SCOLWEI-testnet",
  "name": "Scolcoin WeiChain Testnet",
  "rpc": [
    "https://scolcoin-weichain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.scolcoin.com"
  ],
  "slug": "scolcoin-weichain-testnet",
  "icon": {
    "url": "ipfs://QmVES1eqDXhP8SdeCpM85wvjmhrQDXGRquQebDrSdvJqpt",
    "width": 792,
    "height": 822,
    "format": "png"
  },
  "faucets": [
    "https://faucet.scolcoin.com"
  ],
  "nativeCurrency": {
    "name": "Scolcoin",
    "symbol": "SCOL",
    "decimals": 18
  },
  "infoURL": "https://scolcoin.com",
  "shortName": "SRC-test",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Scolscan Testnet Explorer",
      "url": "https://testnet-explorer.scolcoin.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;