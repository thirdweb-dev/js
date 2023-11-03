import type { Chain } from "../types";
export default {
  "chain": "nmactest",
  "chainId": 7777,
  "explorers": [
    {
      "name": "avascan",
      "url": "https://testnet.avascan.info/blockchain/2mZ9doojfwHzXN3VXDQELKnKyZYxv7833U8Yq5eTfFx3hxJtiy",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://riseofthewarbots.com/",
  "name": "Rise of the Warbots Testnet",
  "nativeCurrency": {
    "name": "Nano Machines",
    "symbol": "NMAC",
    "decimals": 18
  },
  "networkId": 7777,
  "rpc": [
    "https://rise-of-the-warbots-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7777.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet1.riseofthewarbots.com",
    "https://testnet2.riseofthewarbots.com",
    "https://testnet3.riseofthewarbots.com",
    "https://testnet4.riseofthewarbots.com",
    "https://testnet5.riseofthewarbots.com"
  ],
  "shortName": "RiseOfTheWarbotsTestnet",
  "slug": "rise-of-the-warbots-testnet",
  "testnet": true
} as const satisfies Chain;