import type { Chain } from "../src/types";
export default {
  "chain": "NIZA",
  "chainId": 20041,
  "explorers": [
    {
      "name": "NizaScan",
      "url": "https://nizascan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPh2FdjoPWBaCKNrknv6HjruxdUCr8AvJYvhpgHZP6e2C",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://niza.io",
  "name": "Niza Chain Mainnet",
  "nativeCurrency": {
    "name": "Niza Global",
    "symbol": "NIZA",
    "decimals": 18
  },
  "networkId": 20041,
  "rpc": [
    "https://20041.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nizascan.io/rpc"
  ],
  "shortName": "niza",
  "slug": "niza-chain",
  "testnet": false
} as const satisfies Chain;