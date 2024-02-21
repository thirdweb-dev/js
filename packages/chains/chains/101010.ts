import type { Chain } from "../src/types";
export default {
  "chain": "SVRN",
  "chainId": 101010,
  "explorers": [
    {
      "name": "Soverun",
      "url": "https://testnet.soverun.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.soverun.com"
  ],
  "icon": {
    "url": "ipfs://QmTYazUzgY9Nn2mCjWwFUSLy3dG6i2PvALpwCNQvx1zXyi",
    "width": 1154,
    "height": 1154,
    "format": "png"
  },
  "infoURL": "https://soverun.com",
  "name": "Soverun Testnet",
  "nativeCurrency": {
    "name": "Soverun",
    "symbol": "SVRN",
    "decimals": 18
  },
  "networkId": 101010,
  "rpc": [
    "https://101010.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.soverun.com"
  ],
  "shortName": "SVRNt",
  "slip44": 1,
  "slug": "soverun-testnet",
  "testnet": true
} as const satisfies Chain;