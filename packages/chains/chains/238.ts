import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 238,
  "explorers": [
    {
      "name": "Blast Mainnet",
      "url": "https://scan.blastblockchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmdHpjiepU2Q4bt4kR48tKHPgaQW57Sb6UVFgLh4MCyg6U",
    "width": 595,
    "height": 582,
    "format": "png"
  },
  "infoURL": "https://docs.blastblockchain.com",
  "name": "Blast Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 238,
  "rpc": [
    "https://blast.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://238.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.blastblockchain.com"
  ],
  "shortName": "blast",
  "slug": "blast",
  "testnet": false
} as const satisfies Chain;