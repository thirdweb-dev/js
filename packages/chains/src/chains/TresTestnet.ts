import type { Chain } from "../types";
export default {
  "chain": "TresLeches",
  "chainId": 6065,
  "explorers": [
    {
      "name": "treslechesexplorer",
      "url": "https://explorer-test.tresleches.finance",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmS33ypsZ1Hx5LMMACaJaxePy9QNYMwu4D12niobExLK74",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "http://faucet.tresleches.finance:8080"
  ],
  "icon": {
    "url": "ipfs://QmS33ypsZ1Hx5LMMACaJaxePy9QNYMwu4D12niobExLK74",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://treschain.com",
  "name": "Tres Testnet",
  "nativeCurrency": {
    "name": "TRES",
    "symbol": "TRES",
    "decimals": 18
  },
  "networkId": 6065,
  "rpc": [
    "https://tres-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6065.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test.tresleches.finance/"
  ],
  "shortName": "TRESTEST",
  "slug": "tres-testnet",
  "testnet": true
} as const satisfies Chain;