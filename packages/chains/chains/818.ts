import type { Chain } from "../src/types";
export default {
  "chainId": 818,
  "chain": "BOC",
  "name": "BeOne Chain Mainnet",
  "rpc": [
    "https://beone-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed1.beonechain.com",
    "https://dataseed2.beonechain.com",
    "https://dataseed-us1.beonechain.com",
    "https://dataseed-us2.beonechain.com",
    "https://dataseed-uk1.beonechain.com",
    "https://dataseed-uk2.beonechain.com"
  ],
  "slug": "beone-chain",
  "icon": {
    "url": "ipfs://QmbVLQnaMDu86bPyKgCvTGhFBeYwjr15hQnrCcsp1EkAGL",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "BeOne Chain Mainnet",
    "symbol": "BOC",
    "decimals": 18
  },
  "infoURL": "https://beonechain.com",
  "shortName": "BOC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "BeOne Chain Mainnet",
      "url": "https://beonescan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;