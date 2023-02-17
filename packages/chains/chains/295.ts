export default {
  "name": "Hedera Mainnet",
  "chain": "Hedera",
  "icon": {
    "url": "ipfs://QmQikzhvZKyMmbZJd7BVLZb2YTBDMgNDnaMCAErsVjsfuz",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "rpc": [
    "https://hedera.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.hashio.io/api"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "hbar",
    "symbol": "HBAR",
    "decimals": 8
  },
  "infoURL": "https://hedera.com",
  "shortName": "hedera-mainnet",
  "chainId": 295,
  "networkId": 295,
  "slip44": 3030,
  "explorers": [
    {
      "name": "HashScan",
      "url": "https://hashscan.io/mainnet/dashboard",
      "standard": "none"
    },
    {
      "name": "Arkhia Explorer",
      "url": "https://explorer.arkhia.io",
      "standard": "none"
    },
    {
      "name": "DragonGlass",
      "url": "https://app.dragonglass.me",
      "standard": "none"
    },
    {
      "name": "Hedera Explorer",
      "url": "https://hederaexplorer.io",
      "standard": "none"
    },
    {
      "name": "Ledger Works Explore",
      "url": "https://explore.lworks.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "hedera"
} as const;