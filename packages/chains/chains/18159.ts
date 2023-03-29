export default {
  "name": "Proof Of Memes",
  "title": "Proof Of Memes Mainnet",
  "chain": "POM",
  "icon": {
    "url": "ipfs://QmePhfibWz9jnGUqF9Rven4x734br1h3LxrChYTEjbbQvo",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "rpc": [
    "https://proof-of-memes.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.memescan.io",
    "https://mainnet-rpc2.memescan.io",
    "https://mainnet-rpc3.memescan.io",
    "https://mainnet-rpc4.memescan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Proof Of Memes",
    "symbol": "POM",
    "decimals": 18
  },
  "infoURL": "https://proofofmemes.org",
  "shortName": "pom",
  "chainId": 18159,
  "networkId": 18159,
  "explorers": [
    {
      "name": "explorer-proofofmemes",
      "url": "https://memescan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "proof-of-memes"
} as const;