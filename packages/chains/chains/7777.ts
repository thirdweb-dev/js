import type { Chain } from "../src/types";
export default {
  "chainId": 7777,
  "chain": "nmactest",
  "name": "Rise of the Warbots Testnet",
  "rpc": [
    "https://rise-of-the-warbots-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet1.riseofthewarbots.com",
    "https://testnet2.riseofthewarbots.com",
    "https://testnet3.riseofthewarbots.com",
    "https://testnet4.riseofthewarbots.com",
    "https://testnet5.riseofthewarbots.com"
  ],
  "slug": "rise-of-the-warbots-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Nano Machines",
    "symbol": "NMAC",
    "decimals": 18
  },
  "infoURL": "https://riseofthewarbots.com/",
  "shortName": "RiseOfTheWarbotsTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "avascan",
      "url": "https://testnet.avascan.info/blockchain/2mZ9doojfwHzXN3VXDQELKnKyZYxv7833U8Yq5eTfFx3hxJtiy",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;