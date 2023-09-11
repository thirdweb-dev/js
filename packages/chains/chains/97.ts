import type { Chain } from "../src/types";
export default {
  "name": "BNB Smart Chain Testnet",
  "chain": "BSC",
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
  "faucets": [
    "https://testnet.bnbchain.org/faucet-smart"
  ],
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "tBNB",
    "decimals": 18
  },
  "infoURL": "https://www.bnbchain.org/en",
  "shortName": "bnbt",
  "chainId": 97,
  "networkId": 97,
  "explorers": [
    {
      "name": "bscscan-testnet",
      "url": "https://testnet.bscscan.com",
      "standard": "EIP3091"
    }
  ],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/binance-coin/512.png",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "testnet": true,
  "slug": "binance-testnet"
} as const satisfies Chain;