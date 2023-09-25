import type { Chain } from "../src/types";
export default {
  "chainId": 3434,
  "chain": "SCAI",
  "name": "SecureChain Testnet",
  "rpc": [
    "https://securechain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.securechain.ai"
  ],
  "slug": "securechain-testnet",
  "icon": {
    "url": "ipfs://Qme2Z8VFYjhHGfLQPBnfseNpEdRfmTDy7VXqrdH4AHETJf",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "faucets": [
    "https://faucet.securechain.ai"
  ],
  "nativeCurrency": {
    "name": "SCAI",
    "symbol": "SCAI",
    "decimals": 18
  },
  "infoURL": "https://securechain.ai",
  "shortName": "SCAIt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "SecureChain",
      "url": "https://testnet.securechain.ai",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;