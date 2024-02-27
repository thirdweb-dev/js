import type { Chain } from "../src/types";
export default {
  "chain": "SCAI",
  "chainId": 34,
  "explorers": [
    {
      "name": "SecureChain Mainnet",
      "url": "https://explorer.securechain.ai",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qme2Z8VFYjhHGfLQPBnfseNpEdRfmTDy7VXqrdH4AHETJf",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "infoURL": "https://securechain.ai",
  "name": "SecureChain Mainnet",
  "nativeCurrency": {
    "name": "SecureChain",
    "symbol": "SCAI",
    "decimals": 18
  },
  "networkId": 34,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://34.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.scai.network"
  ],
  "shortName": "scai",
  "slug": "securechain",
  "testnet": false
} as const satisfies Chain;