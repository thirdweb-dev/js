import type { Chain } from "../src/types";
export default {
  "chain": "SVRN",
  "chainId": 10101010,
  "explorers": [
    {
      "name": "Soverun",
      "url": "https://explorer.soverun.com",
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
  "name": "Soverun Mainnet",
  "nativeCurrency": {
    "name": "Soverun",
    "symbol": "SVRN",
    "decimals": 18
  },
  "networkId": 10101010,
  "rpc": [
    "https://soverun.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://10101010.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.soverun.com"
  ],
  "shortName": "SVRNm",
  "slug": "soverun",
  "testnet": false
} as const satisfies Chain;