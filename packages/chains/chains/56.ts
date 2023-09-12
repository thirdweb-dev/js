import type { Chain } from "../src/types";
export default {
  "name": "BNB Smart Chain Mainnet",
  "chain": "BSC",
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
  "faucets": [],
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "infoURL": "https://www.bnbchain.org/en",
  "shortName": "bnb",
  "chainId": 56,
  "networkId": 56,
  "slip44": 714,
  "explorers": [
    {
      "name": "bscscan",
      "url": "https://bscscan.com",
      "standard": "EIP3091"
    }
  ],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/binance-coin/512.png",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "testnet": false,
  "slug": "binance"
} as const satisfies Chain;