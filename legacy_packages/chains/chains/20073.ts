import type { Chain } from "../src/types";
export default {
  "chain": "NIZA",
  "chainId": 20073,
  "explorers": [
    {
      "name": "NizaScan",
      "url": "https://testnet.nizascan.io",
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
  "name": "Niza Chain Testnet",
  "nativeCurrency": {
    "name": "Niza Global",
    "symbol": "NIZA",
    "decimals": 18
  },
  "networkId": 20073,
  "rpc": [
    "https://20073.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.nizascan.io/rpc"
  ],
  "shortName": "niza_testnet",
  "slug": "niza-chain-testnet",
  "testnet": true
} as const satisfies Chain;