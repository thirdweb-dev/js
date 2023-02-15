export default {
  "name": "Double-A Chain Testnet",
  "chain": "AAC",
  "icon": {
    "url": "ipfs://QmRUrz4dULaoaMpnqd8qXT7ehwz3aaqnYKY4ePsy7isGaF",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://double-a-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.acuteangle.com"
  ],
  "faucets": [
    "https://scan-testnet.acuteangle.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Acuteangle Native Token",
    "symbol": "AAC",
    "decimals": 18
  },
  "infoURL": "https://www.acuteangle.com/",
  "shortName": "aact",
  "chainId": 513,
  "networkId": 513,
  "explorers": [
    {
      "name": "aacscan-testnet",
      "url": "https://scan-testnet.acuteangle.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "double-a-chain-testnet"
} as const;