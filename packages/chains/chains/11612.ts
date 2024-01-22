import type { Chain } from "../src/types";
export default {
  "chain": "SRDX",
  "chainId": 11612,
  "explorers": [
    {
      "name": "Sardis",
      "url": "https://testnet.sardisnetwork.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.sardisnetwork.com"
  ],
  "icon": {
    "url": "ipfs://QmdR9QJjQEh1mBnf2WbJfehverxiP5RDPWMtEECbDP2rc3",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://mysardis.com",
  "name": "Sardis Testnet",
  "nativeCurrency": {
    "name": "Sardis",
    "symbol": "SRDX",
    "decimals": 18
  },
  "networkId": 11612,
  "rpc": [
    "https://sardis-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://11612.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.sardisnetwork.com"
  ],
  "shortName": "SRDXt",
  "slip44": 1,
  "slug": "sardis-testnet",
  "testnet": true
} as const satisfies Chain;