export default {
  "name": "Double-A Chain Mainnet",
  "chain": "AAC",
  "rpc": [
    "https://double-a-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.acuteangle.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Acuteangle Native Token",
    "symbol": "AAC",
    "decimals": 18
  },
  "infoURL": "https://www.acuteangle.com/",
  "shortName": "aac",
  "chainId": 512,
  "networkId": 512,
  "slip44": 1512,
  "explorers": [
    {
      "name": "aacscan",
      "url": "https://scan.acuteangle.com",
      "standard": "EIP3091"
    }
  ],
  "icon": {
    "url": "ipfs://QmRUrz4dULaoaMpnqd8qXT7ehwz3aaqnYKY4ePsy7isGaF",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "testnet": false,
  "slug": "double-a-chain"
} as const;