import type { Chain } from "../src/types";
export default {
  "chain": "Poodl",
  "chainId": 15257,
  "explorers": [
    {
      "name": "Poodl Testnet Explorer",
      "url": "https://testnet.poodl.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.poodl.org"
  ],
  "icon": {
    "url": "ipfs://QmXfBFHHb5kJGQ3dMLnhDhfFBsgAvm9U72jBSYcfmRHL2p",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://poodl.org",
  "name": "Poodl Testnet",
  "nativeCurrency": {
    "name": "Poodl",
    "symbol": "POODL",
    "decimals": 18
  },
  "networkId": 15257,
  "rpc": [
    "https://15257.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.poodl.org"
  ],
  "shortName": "poodlt",
  "slug": "poodl-testnet",
  "testnet": true
} as const satisfies Chain;