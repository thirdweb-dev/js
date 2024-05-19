import type { Chain } from "../src/types";
export default {
  "chain": "Taf ECO Chain",
  "chainId": 224168,
  "explorers": [
    {
      "name": "Taf ECO Chain Mainnet",
      "url": "https://ecoscan.tafchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.tafchain.com",
  "name": "Taf ECO Chain Mainnet",
  "nativeCurrency": {
    "name": "Taf ECO Chain Mainnet",
    "symbol": "TAFECO",
    "decimals": 18
  },
  "networkId": 224168,
  "rpc": [
    "https://224168.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.tafchain.com/v1"
  ],
  "shortName": "TAFECO",
  "slug": "taf-eco-chain",
  "testnet": false
} as const satisfies Chain;