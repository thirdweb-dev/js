import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 23888,
  "explorers": [
    {
      "name": "Blast Testnet",
      "url": "http://testnet-explorer.blastblockchain.com",
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
  "name": "Blast Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 23888,
  "rpc": [
    "https://blast-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://23888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet-rpc.blastblockchain.com"
  ],
  "shortName": "blastT",
  "slug": "blast-testnet",
  "testnet": true
} as const satisfies Chain;