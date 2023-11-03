import type { Chain } from "../types";
export default {
  "chain": "BSC",
  "chainId": 97,
  "explorers": [
    {
      "name": "bscscan-testnet",
      "url": "https://testnet.bscscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://testnet.bnbchain.org/faucet-smart"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/binance-coin/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.bnbchain.org/en",
  "name": "BNB Smart Chain Testnet",
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "tBNB",
    "decimals": 18
  },
  "networkId": 97,
  "redFlags": [],
  "rpc": [
    "https://binance-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://97.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
    "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
    "https://data-seed-prebsc-1-s2.bnbchain.org:8545",
    "https://data-seed-prebsc-2-s2.bnbchain.org:8545",
    "https://data-seed-prebsc-1-s3.bnbchain.org:8545",
    "https://data-seed-prebsc-2-s3.bnbchain.org:8545",
    "https://bsc-testnet.publicnode.com",
    "wss://bsc-testnet.publicnode.com"
  ],
  "shortName": "bnbt",
  "slug": "binance-testnet",
  "testnet": false
} as const satisfies Chain;