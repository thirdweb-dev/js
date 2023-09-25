import type { Chain } from "../src/types";
export default {
  "chainId": 6065,
  "chain": "TresLeches",
  "name": "Tres Testnet",
  "rpc": [
    "https://tres-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test.tresleches.finance/"
  ],
  "slug": "tres-testnet",
  "icon": {
    "url": "ipfs://QmS33ypsZ1Hx5LMMACaJaxePy9QNYMwu4D12niobExLK74",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "http://faucet.tresleches.finance:8080"
  ],
  "nativeCurrency": {
    "name": "TRES",
    "symbol": "TRES",
    "decimals": 18
  },
  "infoURL": "https://treschain.com",
  "shortName": "TRESTEST",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "treslechesexplorer",
      "url": "https://explorer-test.tresleches.finance",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;