import type { Chain } from "../src/types";
export default {
  "chain": "HYBRID",
  "chainId": 2468,
  "explorers": [
    {
      "name": "Hybrid Chain Explorer Mainnet",
      "url": "https://hybridscan.ai",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmQDNdhPvCrrijEKC3G9Px5if2CHgdxq7Q2Pg66cy9xwbF",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet-testnet.hybridchain.ai"
  ],
  "icon": {
    "url": "ipfs://QmQDNdhPvCrrijEKC3G9Px5if2CHgdxq7Q2Pg66cy9xwbF",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://hybridchain.ai",
  "name": "Hybrid Chain Network Mainnet",
  "nativeCurrency": {
    "name": "Hybrid Chain Native Token",
    "symbol": "HRC",
    "decimals": 18
  },
  "networkId": 2468,
  "rpc": [
    "https://2468.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://coredata-mainnet.hybridchain.ai/",
    "https://rpc-mainnet.hybridchain.ai"
  ],
  "shortName": "hrc",
  "slug": "hybrid-chain-network",
  "testnet": true
} as const satisfies Chain;