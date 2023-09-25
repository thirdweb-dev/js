import type { Chain } from "../src/types";
export default {
  "chainId": 51712,
  "chain": "SRDX",
  "name": "Sardis Mainnet",
  "rpc": [
    "https://sardis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.sardisnetwork.com"
  ],
  "slug": "sardis",
  "icon": {
    "url": "ipfs://QmdR9QJjQEh1mBnf2WbJfehverxiP5RDPWMtEECbDP2rc3",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.sardisnetwork.com"
  ],
  "nativeCurrency": {
    "name": "Sardis",
    "symbol": "SRDX",
    "decimals": 18
  },
  "infoURL": "https://mysardis.com",
  "shortName": "SRDXm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Sardis",
      "url": "https://contract-mainnet.sardisnetwork.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;