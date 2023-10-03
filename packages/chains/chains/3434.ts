import type { Chain } from "../src/types";
export default {
  "chain": "SCAI",
  "chainId": 3434,
  "explorers": [
    {
      "name": "SecureChain",
      "url": "https://testnet.securechain.ai",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.securechain.ai"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://Qme2Z8VFYjhHGfLQPBnfseNpEdRfmTDy7VXqrdH4AHETJf",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "infoURL": "https://securechain.ai",
  "name": "SecureChain Testnet",
  "nativeCurrency": {
    "name": "SCAI",
    "symbol": "SCAI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://securechain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.securechain.ai"
  ],
  "shortName": "SCAIt",
  "slug": "securechain-testnet",
  "testnet": true
} as const satisfies Chain;