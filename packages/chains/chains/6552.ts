import type { Chain } from "../src/types";
export default {
  "name": "Scolcoin WeiChain Testnet",
  "chain": "SCOLWEI-testnet",
  "rpc": [
    "https://scolcoin-weichain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.scolcoin.com"
  ],
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
  "chainId": 6552,
  "networkId": 6552,
  "icon": {
    "url": "ipfs://QmVES1eqDXhP8SdeCpM85wvjmhrQDXGRquQebDrSdvJqpt",
    "width": 792,
    "height": 822,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Scolscan Testnet Explorer",
      "url": "https://testnet-explorer.scolcoin.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "scolcoin-weichain-testnet"
} as const satisfies Chain;