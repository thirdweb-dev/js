import type { Chain } from "../src/types";
export default {
  "chain": "BOC",
  "chainId": 818,
  "explorers": [
    {
      "name": "BeOne Chain Mainnet",
      "url": "https://beonescan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmbVLQnaMDu86bPyKgCvTGhFBeYwjr15hQnrCcsp1EkAGL",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://beonechain.com",
  "name": "BeOne Chain Mainnet",
  "nativeCurrency": {
    "name": "BeOne Chain Mainnet",
    "symbol": "BOC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://beone-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed1.beonechain.com",
    "https://dataseed2.beonechain.com",
    "https://dataseed-us1.beonechain.com",
    "https://dataseed-us2.beonechain.com",
    "https://dataseed-uk1.beonechain.com",
    "https://dataseed-uk2.beonechain.com"
  ],
  "shortName": "BOC",
  "slug": "beone-chain",
  "testnet": false
} as const satisfies Chain;