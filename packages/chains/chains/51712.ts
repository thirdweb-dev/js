import type { Chain } from "../src/types";
export default {
  "chain": "SRDX",
  "chainId": 51712,
  "explorers": [
    {
      "name": "Sardis",
      "url": "https://contract-mainnet.sardisnetwork.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.sardisnetwork.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmdR9QJjQEh1mBnf2WbJfehverxiP5RDPWMtEECbDP2rc3",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://mysardis.com",
  "name": "Sardis Mainnet",
  "nativeCurrency": {
    "name": "Sardis",
    "symbol": "SRDX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://sardis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.sardisnetwork.com"
  ],
  "shortName": "SRDXm",
  "slug": "sardis",
  "testnet": false
} as const satisfies Chain;