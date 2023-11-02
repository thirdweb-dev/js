import type { Chain } from "../src/types";
export default {
  "chain": "Shardeum",
  "chainId": 8081,
  "explorers": [
    {
      "name": "Shardeum Scan",
      "url": "https://explorer-liberty20.shardeum.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.liberty20.shardeum.org"
  ],
  "icon": {
    "url": "ipfs://Qma1bfuubpepKn7DLDy4NPSKDeT3S4VPCNhu6UmdGrb6YD",
    "width": 609,
    "height": 533,
    "format": "png"
  },
  "infoURL": "https://docs.shardeum.org/",
  "name": "Shardeum Liberty 2.X",
  "nativeCurrency": {
    "name": "Shardeum SHM",
    "symbol": "SHM",
    "decimals": 18
  },
  "networkId": 8081,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://shardeum-liberty-2-x.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8081.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://liberty20.shardeum.org/"
  ],
  "shortName": "Liberty20",
  "slug": "shardeum-liberty-2-x",
  "testnet": false
} as const satisfies Chain;