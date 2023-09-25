import type { Chain } from "../src/types";
export default {
  "chainId": 11612,
  "chain": "SRDX",
  "name": "Sardis Testnet",
  "rpc": [
    "https://sardis-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.sardisnetwork.com"
  ],
  "slug": "sardis-testnet",
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
  "shortName": "SRDXt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Sardis",
      "url": "https://testnet.sardisnetwork.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;