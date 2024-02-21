import type { Chain } from "../src/types";
export default {
  "chain": "BSC",
  "chainId": 56,
  "explorers": [
    {
      "name": "bscscan",
      "url": "https://bscscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://bnb.dex.guru",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRaASKRSjQ5btoUQ2rNTJNxKtx2a2RoewgA7DMQkLVEne",
        "width": 83,
        "height": 82,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/binance-coin/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.bnbchain.org/en",
  "name": "BNB Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "networkId": 56,
  "redFlags": [],
  "rpc": [
    "https://56.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bsc-dataseed1.bnbchain.org",
    "https://bsc-dataseed2.bnbchain.org",
    "https://bsc-dataseed3.bnbchain.org",
    "https://bsc-dataseed4.bnbchain.org",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed2.defibit.io",
    "https://bsc-dataseed3.defibit.io",
    "https://bsc-dataseed4.defibit.io",
    "https://bsc-dataseed1.ninicoin.io",
    "https://bsc-dataseed2.ninicoin.io",
    "https://bsc-dataseed3.ninicoin.io",
    "https://bsc-dataseed4.ninicoin.io",
    "https://bsc-rpc.publicnode.com",
    "wss://bsc-rpc.publicnode.com",
    "wss://bsc-ws-node.nariox.org"
  ],
  "shortName": "bnb",
  "slip44": 714,
  "slug": "binance",
  "testnet": false
} as const satisfies Chain;