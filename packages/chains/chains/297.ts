export default {
  "name": "Hedera Previewnet",
  "chain": "Hedera",
  "icon": {
    "url": "ipfs://QmQikzhvZKyMmbZJd7BVLZb2YTBDMgNDnaMCAErsVjsfuz",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "rpc": [
    "https://hedera-previewnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://previewnet.hashio.io/api"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [
    "https://portal.hedera.com"
  ],
  "nativeCurrency": {
    "name": "hbar",
    "symbol": "HBAR",
    "decimals": 8
  },
  "infoURL": "https://hedera.com",
  "shortName": "hedera-previewnet",
  "chainId": 297,
  "networkId": 297,
  "slip44": 3030,
  "explorers": [
    {
      "name": "HashScan",
      "url": "https://hashscan.io/previewnet/dashboard",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "hedera-previewnet"
} as const;