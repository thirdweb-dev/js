export default {
  "name": "Hedera Testnet",
  "chain": "Hedera",
  "icon": {
    "url": "ipfs://QmQikzhvZKyMmbZJd7BVLZb2YTBDMgNDnaMCAErsVjsfuz",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "rpc": [
    "https://hedera-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.hashio.io/api"
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
  "shortName": "hedera-testnet",
  "chainId": 296,
  "networkId": 296,
  "slip44": 3030,
  "explorers": [
    {
      "name": "HashScan",
      "url": "https://hashscan.io/testnet/dashboard",
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
  "testnet": true,
  "slug": "hedera-testnet"
} as const;