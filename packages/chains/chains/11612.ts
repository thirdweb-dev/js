export default {
  "name": "Sardis Testnet",
  "chain": "SRDX",
  "icon": {
    "url": "ipfs://QmdR9QJjQEh1mBnf2WbJfehverxiP5RDPWMtEECbDP2rc3",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://sardis-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.sardisnetwork.com"
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
  "shortName": "SRDXt",
  "chainId": 11612,
  "networkId": 11612,
  "explorers": [
    {
      "name": "Sardis",
      "url": "https://testnet.sardisnetwork.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "sardis-testnet"
} as const;