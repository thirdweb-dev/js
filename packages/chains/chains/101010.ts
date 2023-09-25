import type { Chain } from "../src/types";
export default {
  "chainId": 101010,
  "chain": "SVRN",
  "name": "Soverun Testnet",
  "rpc": [
    "https://soverun-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.soverun.com"
  ],
  "slug": "soverun-testnet",
  "icon": {
    "url": "ipfs://QmTYazUzgY9Nn2mCjWwFUSLy3dG6i2PvALpwCNQvx1zXyi",
    "width": 1154,
    "height": 1154,
    "format": "png"
  },
  "faucets": [
    "https://faucet.soverun.com"
  ],
  "nativeCurrency": {
    "name": "Soverun",
    "symbol": "SVRN",
    "decimals": 18
  },
  "infoURL": "https://soverun.com",
  "shortName": "SVRNt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Soverun",
      "url": "https://testnet.soverun.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;