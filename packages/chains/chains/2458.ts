import type { Chain } from "../src/types";
export default {
  "chain": "HYBRID",
  "chainId": 2458,
  "explorers": [
    {
      "name": "Hybrid Chain Explorer Testnet",
      "url": "https://testnet.hybridscan.ai",
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
  "name": "Hybrid Chain Network Testnet",
  "nativeCurrency": {
    "name": "Hybrid Chain Native Token",
    "symbol": "tHRC",
    "decimals": 18
  },
  "networkId": 2458,
  "rpc": [
    "https://2458.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.hybridchain.ai/"
  ],
  "shortName": "thrc",
  "slip44": 1,
  "slug": "hybrid-chain-network-testnet",
  "testnet": true
} as const satisfies Chain;