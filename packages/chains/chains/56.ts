import type { Chain } from "../src/types";
export default {
  "chainId": 56,
  "chain": "BSC",
  "name": "BNB Smart Chain Mainnet",
  "rpc": [
    "https://binance.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://bsc-ws-node.nariox.org",
    "wss://bsc.publicnode.com",
    "https://bsc.publicnode.com",
    "https://bsc-dataseed4.ninicoin.io",
    "https://bsc-dataseed3.ninicoin.io",
    "https://bsc-dataseed2.ninicoin.io",
    "https://bsc-dataseed1.ninicoin.io",
    "https://bsc-dataseed4.defibit.io",
    "https://bsc-dataseed3.defibit.io",
    "https://bsc-dataseed2.defibit.io",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed4.bnbchain.org",
    "https://bsc-dataseed3.bnbchain.org",
    "https://bsc-dataseed2.bnbchain.org",
    "https://bsc-dataseed1.bnbchain.org"
  ],
  "slug": "binance",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/binance-coin/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "infoURL": "https://www.bnbchain.org/en",
  "shortName": "bnb",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "bscscan",
      "url": "https://bscscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;