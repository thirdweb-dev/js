import type { Chain } from "../src/types";
export default {
  "chainId": 16888,
  "chain": "IVAR",
  "name": "IVAR Chain Testnet",
  "rpc": [
    "https://ivar-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.ivarex.com"
  ],
  "slug": "ivar-chain-testnet",
  "icon": {
    "url": "ipfs://QmV8UmSwqGF2fxrqVEBTHbkyZueahqyYtkfH2RBF5pNysM",
    "width": 519,
    "height": 519,
    "format": "svg"
  },
  "faucets": [
    "https://tfaucet.ivarex.com/"
  ],
  "nativeCurrency": {
    "name": "tIvar",
    "symbol": "tIVAR",
    "decimals": 18
  },
  "infoURL": "https://ivarex.com",
  "shortName": "tivar",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "ivarscan",
      "url": "https://testnet.ivarscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;