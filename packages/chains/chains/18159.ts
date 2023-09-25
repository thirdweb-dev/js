import type { Chain } from "../src/types";
export default {
  "chainId": 18159,
  "chain": "POM",
  "name": "Proof Of Memes",
  "rpc": [
    "https://proof-of-memes.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.memescan.io",
    "https://mainnet-rpc2.memescan.io",
    "https://mainnet-rpc3.memescan.io",
    "https://mainnet-rpc4.memescan.io"
  ],
  "slug": "proof-of-memes",
  "icon": {
    "url": "ipfs://QmePhfibWz9jnGUqF9Rven4x734br1h3LxrChYTEjbbQvo",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Proof Of Memes",
    "symbol": "POM",
    "decimals": 18
  },
  "infoURL": "https://proofofmemes.org",
  "shortName": "pom",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer-proofofmemes",
      "url": "https://memescan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;