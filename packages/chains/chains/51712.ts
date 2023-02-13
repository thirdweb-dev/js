export default {
  "name": "Sardis Mainnet",
  "chain": "SRDX",
  "icon": {
    "url": "ipfs://QmdR9QJjQEh1mBnf2WbJfehverxiP5RDPWMtEECbDP2rc3",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://sardis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.sardisnetwork.com"
  ],
  "faucets": [
    "https://faucet.sardisnetwork.com"
  ],
  "nativeCurrency": {
    "name": "Sardis",
    "symbol": "SRDX",
    "decimals": 18
  },
  "infoURL": "https://mysardis.com",
  "shortName": "SRDXm",
  "chainId": 51712,
  "networkId": 51712,
  "explorers": [
    {
      "name": "Sardis",
      "url": "https://contract-mainnet.sardisnetwork.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "sardis"
} as const;