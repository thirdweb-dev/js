import type { Chain } from "../src/types";
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
    "symbol": "BNB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://binance-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://bsc-testnet.publicnode.com",
    "https://bsc-testnet.publicnode.com",
    "https://data-seed-prebsc-2-s3.bnbchain.org:8545",
    "https://data-seed-prebsc-1-s3.bnbchain.org:8545",
    "https://data-seed-prebsc-2-s2.bnbchain.org:8545",
    "https://data-seed-prebsc-1-s2.bnbchain.org:8545",
    "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
    "https://data-seed-prebsc-1-s1.bnbchain.org:8545"
  ],
  "shortName": "bnbt",
  "slug": "binance-testnet",
  "testnet": true
} as const satisfies Chain;