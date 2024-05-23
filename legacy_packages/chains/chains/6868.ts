import type { Chain } from "../src/types";
export default {
  "chain": "Pools",
  "chainId": 6868,
  "explorers": [
    {
      "name": "poolsscan",
      "url": "https://scan.poolsmobility.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmV18PRFPkp9pwKKJp4ksVDhMEiqNZ8A5DhQapdNCckeeQ",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmV18PRFPkp9pwKKJp4ksVDhMEiqNZ8A5DhQapdNCckeeQ",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.poolschain.org",
  "name": "Pools Mainnet",
  "nativeCurrency": {
    "name": "POOLS Native Token",
    "symbol": "POOLS",
    "decimals": 18
  },
  "networkId": 6868,
  "rpc": [
    "https://6868.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.poolsmobility.com"
  ],
  "shortName": "POOLS",
  "slip44": 6868,
  "slug": "pools",
  "testnet": false
} as const satisfies Chain;