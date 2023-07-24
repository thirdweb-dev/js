import type { Chain } from "../src/types";
export default {
  "name": "SecureChain Testnet",
  "chain": "SCAI",
  "icon": {
    "url": "ipfs://Qme2Z8VFYjhHGfLQPBnfseNpEdRfmTDy7VXqrdH4AHETJf",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "rpc": [
    "https://securechain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.securechain.ai"
  ],
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
  "chainId": 3434,
  "networkId": 3434,
  "explorers": [
    {
      "name": "SecureChain",
      "url": "https://testnet.securechain.ai",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "securechain-testnet"
} as const satisfies Chain;