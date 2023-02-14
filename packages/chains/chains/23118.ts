export default {
  "name": "Opside Testnet",
  "chain": "Opside",
  "rpc": [
    "https://opside-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.opside.network"
  ],
  "faucets": [
    "https://faucet.opside.network"
  ],
  "nativeCurrency": {
    "name": "IDE",
    "symbol": "IDE",
    "decimals": 18
  },
  "infoURL": "https://opside.network",
  "shortName": "opside",
  "chainId": 23118,
  "networkId": 23118,
  "icon": {
    "url": "ipfs://QmeCyZeibUoHNoYGzy1GkzH2uhxyRHKvH51PdaUMer4VTo",
    "width": 591,
    "height": 591,
    "format": "png"
  },
  "explorers": [
    {
      "name": "opsideInfo",
      "url": "https://opside.info",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "opside-testnet"
} as const;