import type { Chain } from "../src/types";
export default {
  "chain": "POM",
  "chainId": 18159,
  "explorers": [
    {
      "name": "explorer-proofofmemes",
      "url": "https://memescan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmePhfibWz9jnGUqF9Rven4x734br1h3LxrChYTEjbbQvo",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://proofofmemes.org",
  "name": "Proof Of Memes",
  "nativeCurrency": {
    "name": "Proof Of Memes",
    "symbol": "POM",
    "decimals": 18
  },
  "networkId": 18159,
  "rpc": [
    "https://18159.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.memescan.io",
    "https://mainnet-rpc2.memescan.io",
    "https://mainnet-rpc3.memescan.io",
    "https://mainnet-rpc4.memescan.io"
  ],
  "shortName": "pom",
  "slug": "proof-of-memes",
  "testnet": false,
  "title": "Proof Of Memes Mainnet"
} as const satisfies Chain;