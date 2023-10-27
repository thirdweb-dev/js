import type { Chain } from "../src/types";
export default {
  "chain": "SCOLWEI-testnet",
  "chainId": 6552,
  "explorers": [
    {
      "name": "Scolscan Testnet Explorer",
      "url": "https://testnet-explorer.scolcoin.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.scolcoin.com"
  ],
  "icon": {
    "url": "ipfs://QmVES1eqDXhP8SdeCpM85wvjmhrQDXGRquQebDrSdvJqpt",
    "width": 792,
    "height": 822,
    "format": "png"
  },
  "infoURL": "https://scolcoin.com",
  "name": "Scolcoin WeiChain Testnet",
  "nativeCurrency": {
    "name": "Scolcoin",
    "symbol": "SCOL",
    "decimals": 18
  },
  "networkId": 6552,
  "rpc": [
    "https://scolcoin-weichain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6552.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.scolcoin.com"
  ],
  "shortName": "SRC-test",
  "slug": "scolcoin-weichain-testnet",
  "testnet": true
} as const satisfies Chain;