export default {
  "name": "Exzo Network Mainnet",
  "chain": "EXZO",
  "icon": {
    "url": "ipfs://QmeYpc2JfEsHa2Bh11SKRx3sgDtMeg6T8KpXNLepBEKnbJ",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "rpc": [
    "https://exzo-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.exzo.technology"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Exzo",
    "symbol": "XZO",
    "decimals": 18
  },
  "infoURL": "https://exzo.network",
  "shortName": "xzo",
  "chainId": 1229,
  "networkId": 1229,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://exzoscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "exzo-network"
} as const;