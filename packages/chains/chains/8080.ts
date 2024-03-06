import type { Chain } from "../src/types";
export default {
  "chain": "Shardeum",
  "chainId": 8080,
  "explorers": [
    {
      "name": "Shardeum Scan",
      "url": "https://explorer-liberty10.shardeum.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.liberty10.shardeum.org"
  ],
  "icon": {
    "url": "ipfs://Qma1bfuubpepKn7DLDy4NPSKDeT3S4VPCNhu6UmdGrb6YD",
    "width": 609,
    "height": 533,
    "format": "png"
  },
  "infoURL": "https://docs.shardeum.org/",
  "name": "Shardeum Liberty 1.X",
  "nativeCurrency": {
    "name": "Shardeum SHM",
    "symbol": "SHM",
    "decimals": 18
  },
  "networkId": 8080,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://8080.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://liberty10.shardeum.org/"
  ],
  "shortName": "Liberty10",
  "slug": "shardeum-liberty-1-x",
  "testnet": false
} as const satisfies Chain;