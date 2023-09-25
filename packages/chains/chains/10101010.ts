import type { Chain } from "../src/types";
export default {
  "chainId": 10101010,
  "chain": "SVRN",
  "name": "Soverun Mainnet",
  "rpc": [
    "https://soverun.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.soverun.com"
  ],
  "slug": "soverun",
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
  "shortName": "SVRNm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Soverun",
      "url": "https://explorer.soverun.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;