import type { Chain } from "../src/types";
export default {
  "chain": "PAXB",
  "chainId": 6701,
  "explorers": [
    {
      "name": "PAXB Explorer",
      "url": "https://scan.paxb.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmSP66CHynXpMYkjV28uLjTR4kjuoJyy92igYYpvLoqHtG",
        "width": 300,
        "height": 300,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmSP66CHynXpMYkjV28uLjTR4kjuoJyy92igYYpvLoqHtG",
    "width": 300,
    "height": 300,
    "format": "png"
  },
  "infoURL": "https://paxb.io/",
  "name": "PAXB Mainnet",
  "nativeCurrency": {
    "name": "PAXB",
    "symbol": "PAXB",
    "decimals": 18
  },
  "networkId": 6701,
  "rpc": [
    "https://6701.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain.paxb.io"
  ],
  "shortName": "PAXB",
  "slug": "paxb",
  "testnet": false
} as const satisfies Chain;