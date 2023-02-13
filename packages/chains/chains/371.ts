export default {
  "name": "Consta Testnet",
  "chain": "tCNT",
  "rpc": [
    "https://consta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.theconsta.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "tCNT",
    "symbol": "tCNT",
    "decimals": 18
  },
  "infoURL": "http://theconsta.com",
  "shortName": "tCNT",
  "chainId": 371,
  "networkId": 371,
  "icon": {
    "url": "ipfs://QmfQ1yae6uvXgBSwnwJM4Mtp8ctH66tM6mB1Hsgu4XvsC9",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer-testnet.theconsta.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "consta-testnet"
} as const;